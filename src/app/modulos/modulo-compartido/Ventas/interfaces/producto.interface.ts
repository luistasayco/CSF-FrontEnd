import { IStock } from './stock.interface';
export interface IProducto {
    itemCode: string;
    itemName: string;
    quantityOnStock: number;
    manageBatchNumbers: string;
    u_SYP_CS_LABORATORIO: string;
    u_SYP_FAMILIA: string;
    // codproducto: string;
    u_SYP_CS_CLASIF: string;
    u_SYP_CS_EABAS: string;
    // u_SYP_CS_SIC: string;
    u_SYP_MONART: string;
    flgrestringido: string;
    // nocubierto: string;
    itemsGroupCode: number;
    flgConvenio: boolean;
    // Nacotico?
    narcotico: boolean;
    valorPVP: number;
    valorVVP: number;
    // valorVVF: number;
    valorIGV: number;
    valorDescuento: number;
    fraccionVenta: number;
    listStockAlmacen: IStock[];
}