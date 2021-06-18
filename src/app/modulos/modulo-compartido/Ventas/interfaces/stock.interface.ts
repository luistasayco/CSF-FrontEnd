export interface IStock {
    itemCode: string;
    itemName: string;
    manBtchNum: string;
    manSerNum: string;
    u_SYP_CS_FAMILIA: string;
    u_SYP_CS_PRODCI: string;
    u_SYP_CS_EABAS: string;
    u_SYP_CS_CLASIF: string;
    u_SYP_CS_LABORATORIO: string;
    priceList: number;
    whsCode: string;
    batchNum: string;
    onHand: number;
    onOrder: number;
    isCommited: number;
    price: number;
    onHandALM: number;
    onOrderALM: number;
    isCommitedALM: number;
    quantityLote: number;
    isCommitedLote: number;
    onOrderLote: number;
    whsName: string;
    expDate: Date;

    quantityinput: number;
    // codproducto: string;
}