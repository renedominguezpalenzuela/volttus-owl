export const tipos_operaciones = [

    {
        
        cod_tipo: 1,
        type1: ["CASH_OUT_TRANSACTION"],
        type2: ["CREDIT_CARD_TRANSACTION ","MLC_CREDIT_CARD_TRANSACTION"],
        usertext: "Send to Card"
    },
    {
        cod_tipo: 2,
        type1: ["CASH_OUT_TRANSACTION"],
        type2: ["DELIVERY_TRANSACTION", "DELIVERY_TRANSACTION_USD", "DELIVERY_TRANSACTION_EUR"],
        usertext: "Home delivery"
    },
    {
        cod_tipo: 3,
        type1: ["TOPUP_RECHARGE"],
        type2: [ "DIRECT_TOPUP"],
        usertext: "Phone Recharge"
    },
    {
        cod_tipo: 4,
        type1: ["CASH_OUT_TRANSACTION"],
        type2: [ ],
        usertext: "Phone Recharge"
    }

]
