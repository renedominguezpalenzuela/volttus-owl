const { Component, xml, useState, useRef, onMounted, onRendered, onWillStart } = owl;
import { API, UImanager } from "../utils.js";
//import { Beneficiarios } from "./sendmoneyCubaBeneficiario.js";
import { ListaTR } from "./listatr.js";
import { Provincias } from "../../data/provincias_cu.js";

//TODO: refactorizar en un componente la parte de las monedas y el importe

export class SendMoneyCuba extends Component {

  static components = { ListaTR };

  inputAvatar = useRef("inputAvatar");
  inputSendRef = useRef("inputSendRef");
  inputReceiveRef = useRef("inputReceiveRef");
  concept = useRef("concept");
  inputSendCurrencyRef = useRef("inputSendCurrencyRef");
  inputReceiveCurrencyRef = useRef("inputReceiveCurrencyRef");

  changingSendAmount = false;
  changingReceiveAmount = false;

  state = useState({
    firstName: "Rene",
    lastName: "Dominguez",
    avatar: "/img/photo-1534528741775-53994a69daeb.jpg",
    address: "",
    nameFull: "",
  })

  datosSelectedTX = useState({
    txID: "",
    allData: null
  })



  beneficiario = useState({

  })

  cardList = useState({
    value: []

  })



  conversionRateSTR = useState({ value: "" });
  conversionRate = useState({ value: 0 });

  feeSTR = useState({ value: "" });
  fee = useState({ value: 0 });


  moneda_vs_USD = 1;

  tipo_operacion = {
    //name: "CASH_OUT_TRANSACTION"
    name: "CREDIT_CARD_TRANSACTION"
  }

  beneficiarioData = useState({
    beneficiariosNames: [],
    cardsList: [],
    selectedBeneficiaryId: '-1',
    selectedCard: '-1',
    cardBankImage: '',
    cardNumber: '',
    cardHolderName:'',
    contactPhone:'',
    deliveryAddress:'',
    receiverCity: '',          //Municipio
    receiverCityID: '',        //Municipio id 
    deliveryArea: '',           //Provincia
    deliveryAreaID: '',         //Provincia id
    deliveryCountry: 'Cuba',
    deliveryCountryCode: 'CU',
    receiverCountry: 'CUB',



  })



  // <!-- step="0.01" min="-9999999999.99" max="9999999999.99" -->
  static template = xml`    
    <div class="sm:grid sm:grid-cols-[34%_64%] gap-y-0 gap-x-2">   
      <div class="card  w-full bg-base-100 shadow-xl rounded-lg">
        <div class="card-title flex flex-col rounded-lg">
          <div>Amount to Send</div>         
        </div>

        <div class="card-body items-center  ">
            <div class="form-control  max-w-xs  ">
                <label class="label">
                  <span class="label-text">You Send</span>  
                </label> 

                <div class="join">                        
                  <div>   
                    <input type="text" t-ref="inputSendRef" t-on-input="onChangeSendInput"    class="input input-bordered join-item text-right" placeholder="0.00"/>
                    <label class="label">
                      <span class="label-text-alt"></span>
                      <span class="label-text-alt ">
                        <div class=" text-right">
                          Send Fee: <t t-esc="this.feeSTR.value"/> 
                        </div>  
                        <div class=" text-right">  
                           <t t-esc="this.conversionRateSTR.value"/> 
                        </div>
                      </span>
                    </label>
                  </div>
                 
                  <select class="select select-bordered join-item" t-on-input="onChangeCurrencySend" t-ref="inputSendCurrencyRef" >                    
                    <option value="usd">USD</option>
                    <option value="eur">EUR</option>
                    <option value="cad">CAD</option>   
                  </select>
                </div>
            </div>
          
              <div class="form-control  max-w-xs   ">
                  <label class="label">
                    <span class="label-text">Received Amount</span>  
                  </label> 

                  <div class="join">        
                    <div>                           
                      <input type="text" t-ref="inputReceiveRef" t-on-input="onChangeReceiveInput"   
                      class="input input-bordered join-item text-right" placeholder="0.00"/>    
                    </div>
                    
                    <select class="select select-bordered join-item" t-ref="inputReceiveCurrencyRef" t-on-input="onChangeCurrencyRecib" >     
                      <option value="cup">CUP</option>
                      <option value="usd">USD</option>
                    </select>
                  </div>

                  <div class="form-control   row-start-4 col-span-2 w-full ">
                  <label class="label">
                    <span class="label-text">Concept</span>
                  </label>
                
                  <textarea t-ref="concept" class="textarea textarea-bordered" placeholder=""  ></textarea>
                </div>
              </div>
    
          <div class="card-actions">         
          </div>
        </div>
   
    </div>
       <!-- Beneficiario -->
          <div class="card  w-full bg-base-100 shadow-xl rounded-lg mt-2">
            <div class="card-title flex flex-col rounded-lg pt-2">
              <div>Beneficiary</div> 
            </div>

            <div class="card-body items-center   ">
              <div class="grid grid-cols-1 sm:grid-cols-2 w-full gap-y-0 gap-x-2 ">

                  <div class="form-control w-full sm:row-start-1 ">
                    <label class="label">
                      <span class="label-text">Select Beneficiary</span>
                    </label>
                    <select t-att-value="this.beneficiarioData.selectedBeneficiaryId"  class="select select-bordered w-full" t-on-input="onChangeSelectedBeneficiario" >
                      <option  t-att-value="-1" >Select Beneficiary</option>
                      <t t-foreach="this.beneficiarioData.beneficiariosNames" t-as="unBeneficiario" t-key="unBeneficiario._id">
                        <option t-att-value="unBeneficiario._id"><t t-esc="unBeneficiario.beneficiaryFullName"/></option>
                      </t>    
                                
                    </select>
                  </div> 
                  
                  <div class="form-control w-full  sm:row-start-2 ">
                    <label class="label">
                        <span class="label-text">Select Card</span>
                    </label>
                  
                    <select t-att-value="this.beneficiarioData.selectedCard" class="select select-bordered w-full" t-on-input="onChangeSelectedCard">
                      <option  t-att-value="-1" >Select Card</option>
                      <t t-foreach="this.beneficiarioData.cardsList" t-as="unCard" t-key="unCard.number">
                        <option t-att-value="unCard.number">
                          
                          <t t-esc="unCard.currency"/> -
                          <t t-esc="unCard.number"/>
                        </option>
                      </t>             
                  </select>
                </div>


                <div class="form-control w-full  sm:row-start-2 ">
                    <label class="label">
                      <span class="label-text">Card Number</span>
                    </label>
                    <input type="text" t-att-value="this.beneficiarioData.cardNumber" maxlength="19" placeholder="0000-0000-0000-0000" class="input input-bordered w-full "  t-on-keydown="onCardInputKeyDown" t-on-input="onChangeCardInput" />   
                </div>

                <div class=" flex items-center w-full row-start-3 mt-1">
                  <img t-att-src="this.beneficiarioData.cardBankImage" alt="" class="ml-3  sm:w-[10vw] w-[30vw]"/>
                </div>

                
                <div class="form-control w-full  sm:row-start-4 ">
                <label class="label">
                  <span class="label-text">Card Holder Name</span>
                </label>
                <input type="text"   t-att-value="this.beneficiarioData.cardHolderName" maxlength="300" placeholder="" class="input input-bordered w-full "  t-on-input="onChangeCardHolderInput" />   
               </div>

               <div class="form-control w-full sm:row-start-4 ">
               <label class="label">
                 <span class="label-text">Contact Phone</span>
               </label>
               <input type="text" t-att-value="this.beneficiarioData.contactPhone"  maxlength="300" placeholder="" class="input input-bordered w-full "  t-on-input="onChangePhoneInput" />   
              </div>

              
              <div class="form-control  sm:col-span-2 w-full sm:row-start-5">
              <label class="label">
                <span class="label-text">Delivery Address</span>
              </label>           
              <textarea t-att-value="this.beneficiarioData.deliveryAddress" class="textarea textarea-bordered" placeholder="" t-on-input="onChangeAddressInput" ></textarea>
             </div>


             <div class="form-control w-full sm:row-start-6 ">
             <label class="label">
               <span class="label-text">Province</span>
             </label>
             <select t-att-value="this.beneficiarioData.deliveryAreaID" class="select select-bordered w-full" t-on-input="onChangeProvince">
               <t t-foreach="this.provincias" t-as="unaProvincia" t-key="unaProvincia.id">
                 <option t-att-value="unaProvincia.id"><t t-esc="unaProvincia.nombre"/></option>
               </t>             
             </select>
           </div>

           <div class="form-control w-full sm:row-start-6 ">
             <label class="label">
               <span class="label-text">City</span>
             </label>
             <select t-att-value="this.beneficiarioData.receiverCityID" class="select select-bordered w-full" t-on-input="onChangeCity">
               <option t-att-disabled="true" t-att-value="-1" >Select city</option>
               <t t-foreach="this.municipios" t-as="unMunicipio" t-key="unMunicipio.id">
                 <option  t-att-value="unMunicipio.id"><t t-esc="unMunicipio.nombre"/></option>
               </t>             
             </select>
           </div>

           <div class="form-control w-full max-w-xs sm:row-start-7 ">
             <label class="label">
               <span class="label-text">Country</span>
             </label>
             <input type="text" value="Cuba" readonly="true" maxlength="100" placeholder="Country" class="input input-bordered w-full"  t-on-input="onChangeCountryInput" />   
           </div> 

              
                          
                
            </div>
          </div>
         
        
        </div>    
        <!-- Beneficiario END -->


       <button class="btn btn-primary mt-2 sm:row-start-2 row-start-3 w-[30%]" t-on-click="onSendMoney">Send</button>


     <div class="card  w-full bg-base-100 shadow-xl rounded-lg mt-2 sm:row-start-3 row-start-4 sm:col-span-2">
       <div class="card-body items-center  ">
         <ListaTR tipooperacion="this.tipo_operacion.name" onChangeSelectedTX.bind="this.onChangeSelectedTX" />
       </div>
     </div>
      
    </div>

  `;




  //CASH_OUT_TRANSACTION
  setup() {

    const accessToken = API.getTokenFromSessionStorage();
    //const walletAddress = window.sessionStorage.getItem('walletAddress');
    //const userId = window.sessionStorage.getItem('userId');

    onWillStart(async () => {
      const api = new API(accessToken);

      //Pidiendo las tasas de conversion de monedas
      await this.pedirTasadeCambio("usd", "cup");

      //obteniendo todos los datos de los beneficiarios desde el API
      const allDatosBeneficiarios = await api.getAllDatosBeneficiarios();
      if (allDatosBeneficiarios) {
        window.sessionStorage.setItem('beneficiariesFullData', JSON.stringify(allDatosBeneficiarios));
      }
      this.allDatosBeneficiariosFromStorage = JSON.parse(window.sessionStorage.getItem('beneficiariesFullData'));
      if (this.allDatosBeneficiariosFromStorage) {
        this.beneficiarioData.beneficiariosNames = this.allDatosBeneficiariosFromStorage.map(el => ({
          beneficiaryFullName: el.beneficiaryFullName,
          _id: el._id,
          CI: el.deliveryCI
        }));




        this.beneficiarioData.cardsList = this.allDatosBeneficiariosFromStorage[0].creditCards;

      }

      this.provincias = Provincias;
      this.municipios = UImanager.addKeyToMunicipios(this.provincias[0].municipios);

      this.cardRegExp = await api.getCardRegExp();


    });

    onRendered(() => {

    });

    onMounted(async () => {
      this.setearBeneficiario(this.beneficiarioData.beneficiariosNames[0].CI);

    })

  }


  async pedirTasadeCambio(sendCurrency, receiveCurrency) {
    const accessToken = window.sessionStorage.getItem('accessToken');
    const api = new API(accessToken);

    if (receiveCurrency && sendCurrency) {
      const exchangeRate = await api.getExchangeRate(sendCurrency);
      if (exchangeRate) {
        this.conversionRate.value = exchangeRate[receiveCurrency.toUpperCase()];
        this.moneda_vs_USD = exchangeRate["USD"];
        this.conversionRateSTR.value = `1 ${sendCurrency.toUpperCase()} = ${this.conversionRate.value} ${receiveCurrency.toUpperCase()}`;
        this.feeSTR.value = '-';
      }
    }
  }


  async onChangeCurrency() {

    this.inputReceiveRef.el.value = (0).toFixed(2);
    this.inputSendRef.el.value = (0).toFixed(2);

    const sendCurrency = this.inputSendCurrencyRef.el.value;
    const receiveCurrency = this.inputReceiveCurrencyRef.el.value;

    await this.pedirTasadeCambio(sendCurrency, receiveCurrency);

  }

  onChangeCurrencySend() {
    this.onChangeCurrency();
  }

  onChangeCurrencyRecib() {
    this.onChangeCurrency();
  }



  onChangeSendInput = API.debounce(async () => {

    if (this.changingReceiveAmount) { return; }
    this.changingSendAmount = true;
    this.changingReceiveAmount = false;

    //ACtualizar variables de tasas de cambio
    const sendCurrency = this.inputSendCurrencyRef.el.value;
    const receiveCurrency = this.inputReceiveCurrencyRef.el.value;
    await this.pedirTasadeCambio(sendCurrency, receiveCurrency);

    //Pide el fee y Calcula el resultado
    //TODO: refactorizar, pedir el fee una funcion, calcular los resultados otra
    const accessToken = window.sessionStorage.getItem('accessToken');
    const resultado = await UImanager.onChangeSendInput(
      receiveCurrency,                            //moneda recibida
      sendCurrency,                               //moneda del que envia
      this.inputSendRef.el.value,                 //cantidad a enviar
      this.conversionRate.value,
      accessToken,
      this.moneda_vs_USD
    )
    

    this.fee.value = resultado.fee;
    this.feeSTR.value = resultado.feeSTR;

    this.inputReceiveRef.el.value = resultado.receiveAmount;
    this.inputSendRef.el.value = UImanager.roundDec(this.inputSendRef.el.value);

    this.changingSendAmount = false;
    this.changingReceiveAmount = false;

  }, 700);

  onChangeReceiveInput = API.debounce(async () => {

    if (this.changingSendAmount) { return; }
    this.changingSendAmount = false;
    this.changingReceiveAmount = true;

    //ACtualizar variables de tasas de cambio
    const sendCurrency = this.inputSendCurrencyRef.el.value;
    const receiveCurrency = this.inputReceiveCurrencyRef.el.value;
    await this.pedirTasadeCambio(sendCurrency, receiveCurrency);

    //LLAMADA
    const accessToken = window.sessionStorage.getItem('accessToken');
    const resultado = await UImanager.onChangeReceiveInput(
      this.inputReceiveCurrencyRef.el.value,
      this.inputSendCurrencyRef.el.value,
      this.inputReceiveRef.el.value,
      this.conversionRate.value,
      accessToken,
      this.moneda_vs_USD
    )
    

    this.fee.value = resultado.fee;
    this.feeSTR.value = resultado.feeSTR;
    this.inputSendRef.el.value = resultado.sendAmount;
    this.inputReceiveRef.el.value = UImanager.roundDec(this.inputReceiveRef.el.value);

    this.changingSendAmount = false;
    this.changingReceiveAmount = false;

  }, 700);


  async onSendMoney() {
    //cardCUP	cardUSD
    const service = `card${this.inputReceiveCurrencyRef.el.value.toUpperCase()}`;

    //TODO: Validaciones
    const datosTX = {
      service: service,
      amount: this.inputSendRef.el.value,                                           //Cantidad a enviar, incluyendo el fee
      currency: this.inputSendCurrencyRef.el.value.toUpperCase(),                   //moneda del envio
      deliveryAmount: this.inputReceiveRef.el.value,                                //Cantidad que recibe el beneficiario
      deliveryCurrency: this.inputReceiveCurrencyRef.el.value.toUpperCase(),        //moneda que se recibe      
      concept: this.concept.el.value,                                               //Concepto del envio
      merchant_external_id: API.generateRandomID(),
      paymentLink: true,
      ...this.beneficiario
    }

    console.log("DATOS")


    console.log(datosTX);

    if (!this.validarDatos(datosTX)) {
      console.log("Validation Errors");
      return;
    }


    try {

      const accessToken = window.sessionStorage.getItem('accessToken');
      const api = new API(accessToken);
      const resultado = await api.createTX(datosTX);

      //TODO OK
      if (resultado.data) {
        if (resultado.data.status === 200) {
          Swal.fire(resultado.data.payload);
        }
      }

      //Error pero aun responde el API
      if (resultado.response) {
        Swal.fire(resultado.response.data.message);
      }

    } catch (error) {
      console.log(error);
      // Swal.fire(resultado.response.data.message);
    }

  }


  validarDatos(datos) {
    console.log(datos)
    //--------------------- Sending amount --------------------------------------------
    if (!datos.amount) {
      Swal.fire({
        icon: 'error', title: 'Error',
        text: 'Please enter the sending amount'
      })
      return false;
    } else if (datos.amount <= 0) {
      Swal.fire({
        icon: 'error', title: 'Error',
        text: 'Sending amount must be greater than zero'
      })
      return false;
    }

    //--------------------- Receivers amount --------------------------------------------
    if (datos.deliveryAmount <= 0) {
      Swal.fire({
        icon: 'error', title: 'Error',
        text: 'The received amount must be greater than zero'
      })
      return false;
    }

    //--------------------- Municipio --------------------------------------------
    if (!datos.receiverCity || datos.receiverCity === '') {
      Swal.fire({
        icon: 'error', title: 'Error',
        text: 'Please select city'
      })
      return false;
    }

    //--------------------- Nombre --------------------------------------------
    if (!datos.cardHolderName || datos.cardHolderName === '') {
      Swal.fire({
        icon: 'error', title: 'Error',
        text: 'Please enter the full name of receiver. First name and Last name at least'
      })
      return false;
    }



    //--------------------- address --------------------------------------------
    if (!datos.deliveryAddress || datos.deliveryAddress === '') {
      Swal.fire({
        icon: 'error', title: 'Error',
        text: 'Please enter the address'
      })
      return false;
    }

    //--------------------- Phone --------------------------------------------
    if (!datos.contactPhone || datos.contactPhone === '') {
      Swal.fire({
        icon: 'error', title: 'Error',
        text: 'Please enter the phone number'
      })
      return false;
    }

    return true;

  }


  onChangeSelectedTX = async (datos) => {
    this.datosSelectedTX.txID = datos._id;
    this.datosSelectedTX.allData = { ...datos }
    this.inputSendRef.el.value = datos.transactionAmount.toFixed(2);
    this.inputReceiveCurrencyRef.el.value = datos.metadata.deliveryCurrency.toLowerCase();
    this.inputSendCurrencyRef.el.value = datos.currency.toLowerCase();
    this.concept.el.value = datos.concept;



    const CIBeneficiariodeTX = this.datosSelectedTX.allData.metadata.deliveryCI;
    





    this.setearBeneficiario(CIBeneficiariodeTX)




    await this.onChangeSendInput()

  }

  /*

  onChangeDatosBeneficiarios(IDBeneficiarioSeleccionado) {

    
    const beneficiarioSelected = this.allDatosBeneficiariosFromStorage.filter((unBeneficiario) => unBeneficiario._id === IDBeneficiarioSeleccionado)[0];
    

    //this.beneficiario = datosBeneficiario;
    this.beneficiarioData.cardsList = beneficiarioSelected.creditCards;

    
  }*/



  setearBeneficiario = async (CIBeneficiario) => {

    

    const beneficiarioName = this.beneficiarioData.beneficiariosNames.filter((unBeneficiario) => unBeneficiario.CI === CIBeneficiario)[0];

    if (!beneficiarioName) { return }

    
    this.beneficiarioData.selectedBeneficiaryId = beneficiarioName._id;

    this.setearDatosBeneficiario(beneficiarioName._id)





  }




  onChangeSelectedCard = async (event) => {


    

    this.beneficiarioData.selectedCard = event.target.value


    const formatedCardNumber = UImanager.formatCardNumber(event.target.value);
    

    const cardData = this.beneficiarioData.cardsList.filter((unaCard) =>
      UImanager.formatCardNumber(unaCard.number) === formatedCardNumber
    )[0];



    if (cardData) {
      console.log("Hay card data");
      console.log(cardData);
      this.beneficiarioData.cardNumber = formatedCardNumber;

      this.beneficiarioData.cardHolderName = cardData.cardHolderName;


      //cardHolderName
      /*this.selectedCard.el.value = event.target.value; 
      
      this.state.cardNumber = formatedCardNumber;
      
     
      */
      await this.buscarLogotipoBanco(this.beneficiarioData.selectedCard);

    } else {
      console.log("NO Hay card data");
   
      this.beneficiarioData.cardHolderName='';
      /*this.state.cardNumber = '';
      this.cardNumber.el.value='';
      */
    }



    //this.props.onChangeDatosBeneficiarios(this.state);
  }

  
  onChangeSelectedBeneficiario = async (event) => {
    const selectedBeneficiaryId = event.target.value;
    this.beneficiarioData.selectedBeneficiaryId = selectedBeneficiaryId;


    this.setearDatosBeneficiario(selectedBeneficiaryId);

    
    //this.beneficiarioData.selectedBeneficiaryId: '-1',
    this.beneficiarioData.selectedCard= '-1',
    this.beneficiarioData.cardBankImage= '',
    this.beneficiarioData.cardNumber= '',
    this.beneficiarioData.cardHolderName=''



  }


  setearDatosBeneficiario = async (idBeneficiario) => {

    //Setear el select de tarjetas con la tarjeta de la operacion

    
   console.log("setear datos beneficiario")

    const beneficiarioSelected = this.allDatosBeneficiariosFromStorage.filter((unBeneficiario) => unBeneficiario._id === idBeneficiario)[0];
    console.log(beneficiarioSelected)

    this.beneficiarioData.cardsList = beneficiarioSelected.creditCards;

    this.beneficiarioData.contactPhone = beneficiarioSelected.deliveryPhone;
    this.beneficiarioData.deliveryAddress = beneficiarioSelected.houseNumber + ', ' + beneficiarioSelected.streetName + '. ZipCode: ' + beneficiarioSelected.zipcode;


    
      //Inicializando provincia
      const selectedProvince = this.provincias.filter(unaProvincia => unaProvincia.nombre === beneficiarioSelected.deliveryArea)[0];
      if (selectedProvince) {
        this.beneficiarioData.deliveryAreaID = selectedProvince.id;
        this.beneficiarioData.deliveryArea = selectedProvince.nombre;
      } else {
        this.beneficiarioData.deliveryAreaID = "-1";
        this.beneficiarioData.deliveryArea = "";
        this.beneficiarioData.receiverCityID = -1;
        this.beneficiarioData.receiverCity = '';
        return;
      }

      //inicializando municipio
      //this.municipios = selectedProvince.municipios;
      this.municipios = UImanager.addKeyToMunicipios(selectedProvince.municipios);

      // console.log("Beneficiario municipio:")
      // console.log(selectedBenefiarioData.deliveryCity)
      // console.log(selectedBenefiarioData)

      const selectedMuncipio = this.municipios.filter((unMunicipio) => {
        const comparacion = UImanager.eliminarAcentos(beneficiarioSelected.deliveryCity) == UImanager.eliminarAcentos(unMunicipio.nombre);
        return comparacion
      })[0];



      if (selectedMuncipio) {
        this.beneficiarioData.receiverCityID = selectedMuncipio.id;
        this.beneficiarioData.receiverCity = selectedMuncipio.nombre;
        this.beneficiarioData.deliveryZona = selectedProvince.id === "4" ? "Habana" : "Provincias";
      } else {
        this.beneficiarioData.receiverCityID = -1;
        this.beneficiarioData.receiverCity = '';
      }

    if (!this.datosSelectedTX.allData) { 
      this.beneficiarioData.cardHolderName = '';
      return
    
    }
    this.beneficiarioData.cardHolderName = this.datosSelectedTX.allData.metadata.cardHolderName;
    this.beneficiarioData.selectedCard = this.datosSelectedTX.allData.metadata.cardNumber.replace(/ /g, "")
    console.log("Operacion")
    
    console.log(this.datosSelectedTX.allData);




    //const selectedCardNumber = this.props.datosSelectedTX.allData.metadata.cardNumber.replace(/ /g, "");

   

    //const selectedCard = this.props.cardsList.filter((unCard)=>unCard.number ===selectedCardNumber )[0];
    
    //this.selectedCard.el.value = selectedCardNumber;

    


    const formatedCardNumber = UImanager.formatCardNumber(this.beneficiarioData.selectedCard);
    this.beneficiarioData.cardNumber = formatedCardNumber;

     await this.buscarLogotipoBanco(this.beneficiarioData.selectedCard);
     
    //this.selectedCard.el.value="9225959875865500"





  }

  async buscarLogotipoBanco(CardNumber) {
    // const cardWithoutSpaces = this.state.cardNumber.replace(/ /g, "");

    // const api = new API(this.accessToken);
    //const cardRegExp = await api.getCardRegExp();

  

    for (const key in this.cardRegExp) {

      const regexp = new RegExp(this.cardRegExp[key]);
      //const card = this.state.cardNumber.replace(/ /g, "");
    
      const resultado = regexp.test(CardNumber);
     
      if (resultado) {
       
        switch (key) {
          case 'BANDEC_CARD':
            //Poner imagen
            this.beneficiarioData.cardBankImage = "img/logo-bandec.png";
            this.beneficiarioData.bankName = "BANDEC";

            break;

          case 'BANMET_CARD':
            //Poner imagen
            this.beneficiarioData.cardBankImage = "img/logo-metro.png";
            this.beneficiarioData.bankName = "METROPOLITANO";

            break;

          case 'BPA_CARD':
            //Poner imagen
            this.beneficiarioData.cardBankImage = "img/logo-bpa.png";
            this.beneficiarioData.bankName = "BPA";

            break;

          default:
            //this.beneficiarioData.cardBankImage = '';
            //this.beneficiarioData.bankName = '';

            break;
        }

      }




    }




  }


  //Al teclear el card en el input
  onCardInputKeyDown = API.debounce(async (event) => {
    
    if (event.target.value.length === 19) {
      this.beneficiarioData.selectedCard = event.target.value.replace(/ /g, "");
      //this.beneficiarioData.cardNumber = event.target.value;
     // this.cardNumber.el.value =  event.target.value;
      await this.buscarLogotipoBanco(this.beneficiarioData.selectedCard);
      //this.props.onChangeDatosBeneficiarios(this.state);
      //TODO: si es un card nuevo agregarlo?
    }
  }, API.tiempoDebounce);

  
  async onChangeCardInput  (event) {
   
     this.beneficiarioData.cardNumber = UImanager.formatCardNumber(event.target.value);
    

  };

  
  onChangeCardHolderInput = API.debounce(async (event) => {
    this.beneficiarioData.cardHolderName = event.target.value;

    //this.props.onChangeDatosBeneficiarios(this.state);
  }, API.tiempoDebounce);

  onChangeAddressInput = API.debounce(async (event) => {
    this.beneficiarioData.deliveryAddress = event.target.value;

    //this.props.onChangeDatosBeneficiarios(this.state);
  }, API.tiempoDebounce);

  onChangePhoneInput = API.debounce(async (event) => {
    this.beneficiarioData.contactPhone = event.target.value;

    //this.props.onChangeDatosBeneficiarios(this.state);
  }, API.tiempoDebounce);


  

  //Evento al cambiar de provincia, se setea delivery area, se modifica la lista de municipips
  onChangeProvince = (event) => {
    //this.cambioBeneficiario = true;
    if (this.inicializando) return;
    const selectedProvinceId = event.target.value;
    this.beneficiarioData.deliveryAreaID = event.target.value;
    let selectedProvince = this.provincias.filter(unaProvincia => unaProvincia.id === selectedProvinceId)[0];
    if (selectedProvince) {
      this.municipios = UImanager.addKeyToMunicipios(selectedProvince.municipios);
      this.beneficiarioData.receiverCityID = -1;
      this.beneficiarioData.receiverCity = '';
      this.beneficiarioData.deliveryArea = selectedProvince.nombre;
      this.beneficiarioData.deliveryZona = selectedProvince.id === "4" ? "Habana" : "Provincias";
      //this.props.onChangeDatosBeneficiarios(this.state);
    }
  };

  //Evento al cambiar de municipio
  onChangeCity = (event) => {
   // this.cambioBeneficiario = true;
    if (this.inicializando) return;
    const selectedCityId = event.target.value;
    let selectedMunicipio = this.municipios[selectedCityId];
    console.log(selectedMunicipio)
    if (selectedMunicipio) {
      this.beneficiarioData.receiverCity = selectedMunicipio.nombre;
      this.beneficiarioData.receiverCityID = selectedCityId;
     // this.props.onChangeDatosBeneficiarios(this.state);
    }
  };





}

