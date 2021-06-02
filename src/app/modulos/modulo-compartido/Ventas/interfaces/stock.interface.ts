export interface IStock {
    itemCode: string;
    itemName: string;
    manBtchNum: string;
    manSerNum: string;
    u_SYP_CS_FAMILIA: string;
    // u_SYP_CS_SIC: string;
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
    onHand_1: number;
    onOrder_1: number;
    isCommited_1: number;
    quantity: number;
    isCommited_2: number;
    onOrder_2: number;
    whsName: string;
    expDate: Date;

    quantityinput: number;
    // codproducto: string;
}