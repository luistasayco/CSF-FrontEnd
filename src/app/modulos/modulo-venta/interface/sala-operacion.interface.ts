import { IStock } from '../../modulo-compartido/Ventas/interfaces/stock.interface';
export interface IResultBusquedaSalaOperacion {
    idborrador: number;
    codrolsala: number;
    operacion: string;
    codatencion: string;
    nombres: string;
    desalmacen: string;
    fechahoraregistro: Date;
    flgestado: boolean;
    flgventa: boolean;
    codventa: string;
}

export interface ISalaOperacionCreate {
    codrolsala: number;
    codatencion: string;
    codalmacen: string;
    listaSalaOperacionDetalle: ISalaOperacionDetalleSave[];
    listSalaOperacionDetalleUbicacion: ISalaOperacionDetalleUbicacionSave[];
}

export interface ISalaOperacionDetalleCreate {
    codproducto: string;
    nombreproducto: string;
    cantidad: number;
    manbtchnum: boolean;
    binactivat: boolean;
    flgbtchnum: boolean;
    flgbin: boolean;
    listStockLote: IStock []
}

export interface ISalaOperacionDetalleSave {
    codproducto: string;
    nombreproducto: string;
    cantidad: number;
    manbtchnum: boolean;
    binactivat: boolean;
    flgbtchnum: boolean;
    flgbin: boolean;
    listaSalaOperacionDetalleLote: ISalaOperacionDetalleLoteSave[];
}

export interface ISalaOperacionDetalleLoteSave {
    codproducto: string;
    lote: string;
    fechavencimiento: Date;
    cantidad: number;
}

export interface ISalaOperacionDetalleUbicacionSave {
    codproducto: string;
    ubicacion: number;
    ubicaciondescripcion: string;
    cantidad: number;
}

export interface ISalaOperacionEliminar {
    idborrador: number;
}

export interface ISalaOperacionEstado {
    idborrador: number;
}

export interface IResultBusquedaSalaOperacionRol {
    codatencion: string;
    nombrepaciente: string;
    operacion: string;
    codrolsala: number;
    estado: string;
}

export interface ISalaOperacionModificarRol {
    idborrador: number;
    codrolsala: number;
    codatencion: string;
}