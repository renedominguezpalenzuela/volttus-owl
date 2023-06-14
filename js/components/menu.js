const { Component, mount, xml, useState, useRef, onMounted, onRendered, onWillStart, onWillUpdateProps } = owl;


export class Menu extends Component {
    static template=xml`


            <div class="navbar hidden sm:flex ">
                <div class="navbar-start ">
                    
                <div class="text-[1.5rem]  font-[600] pl-1 ">
                    <t t-esc="props.title"/>
                </div>
                        
                              
                </div>
                <div class="navbar-center ">
                    
                </div>
                <div class="navbar-end">
                    <ul class="menu menu-horizontal px-1">
                    
                        <li>
                            <a class="dropdown-item" href="/listatr.html">TX List</a>
                        </li>

                        <li tabindex="0">
                            <details>
                                <summary>Send Money</summary>
                                <ul class="p-2">
                                    <li><a class="dropdown-item" href="/sendmoney.html">Send Money Cuba</a></li>
                                    <li><a>Submenu 1</a></li>
                                    <li><a>Submenu 2</a></li>
                                </ul>
                            </details>
                        </li>

                        <li>
                            <a class="dropdown-item" href="/userdata.html">User Balance</a>
                        </li>
                    </ul>
                  
                </div>
        </div>


    
    `;


    
  setup() {
  


    onWillStart(() => {
        // console.logs(props)

    });

    onMounted(() => {
      
    });


    onRendered(() => {
      
    });

  }
}
