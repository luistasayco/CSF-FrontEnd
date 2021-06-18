import { Observable } from 'rxjs';
import { IStock } from '../../modulo-compartido/Ventas/interfaces/stock.interface';
export interface IResultBusquedaVenta {
    codventa: string;
    codalmacen: string;
    tipomovimiento: string;
    codempresa: string;
    codtipocliente: string;
    nombretipocliente: string;
    codatencion: string;
    codcomprobante: string;
    estado: string;
    nombreestado: string;
    nombre: string;
    montopaciente: number;
    montoaseguradora: number;
    flg_gratuito: boolean;
    fechagenera: Date;
    fechaemision: Date;
    codpaciente: string;
    codcliente: string;
    codpedido: string;
    usuarioanulacion: string;
}

export interface IVentaCabeceraSingle {
    codventa: string;
    codalmacen: string;
    tipomovimiento: string;
    codcomprobante: string;
    codempresa: string;
    codtipocliente: string;
    codcliente: string;
    codpaciente: string;
    nombre: string;
    cama: string;
    codmedico: string;
    codatencion: string;
    codpresotor: string;
    codpoliza: string;
    planpoliza: string;
    deducible: number;
    codaseguradora: string;
    codcia: string;
    porcentajecoaseguro: number;
    porcentajeimpuesto: number;
    fechagenera: Date;
    fechaemision: Date;
    fechacancelacion: Date;
    fechaanulacion: Date;
    montodctoplan: number;
    porcentajedctoplan: number;
    moneda: string;
    montototal: number;
    montoigv: number;
    montoneto: number;
    codplan: string;
    montognc: number;
    montopaciente: number;
    montoaseguradora: number;
    observacion: string;
    codcentro: string;
    // coduser: string;
    estado: string;
    nombremedico: string;
    nombreaseguradora: string;
    nombrecia: string;
    codventadevolucion: string;
    tipocambio: number;
    codpedido: string;
    usuarioanulacion: string;
    nombrediagnostico: string;
    flagpaquete: string;
    fecha_envio: string;
    fecha_entrega: Date;
    flg_gratuito: boolean;
    flg_enviosap: boolean;
    fec_enviosap: Date;
    ide_docentrysap: number;
    fec_docentrysap: Date;
    ide_tablaintersap: number;
    nombreestado: string;
    nombretipocliente: string;
    nombrealmacen: string;
    nombreplan: string;
    autorizado: string;
    codcomprobantee: string;
    tienedevolucion: boolean;
    ruccliente: string;
    dircliente: string;
    tipdocidentidad: string;
    docidentidad: string;
    nombretipdocidentidad: string;
    correocliente: string;
    moneda_comprobantes: string;
    numeroplanilla: string;
    listaVentaDetalle: IVentaDetalle[];
}

export interface IVentaDetalle {
    coddetalle: string;
    codventa: string;
    codalmacen: string;
    tipomovimiento: string;
    codproducto: string;
    cantidad: number;
    // cantidad_fraccion: number;
    preciounidadcondcto: number;
    precioventaPVP: number;
    valorVVF: number;
    valorVVP: number;
    stockalmacen: number;
    // stockalm_fraccion: number;
    porcentajedctoproducto: number;
    montototal: number;
    montopaciente: number;
    montoaseguradora: number;
    fechagenera: Date;
    fechaemision: Date;
    stockfraccion: number;
    // costocompra: number;
    // promedio: number;
    estado: string;
    gnc: string;
    codpedido: string;
    // cant_traentcon: number;
    // cant_deventcon: number;
    // cant_tramencon: number;
    // cant_devmencon: number;
    // promediomn: number;
    nombreproducto: string;
    porcentajedctoplan: number;
    porcentajecoaseguro: number;
    valor_dscto: number;
    manBtchNum: boolean;
    flgnarcotico: boolean;
    listVentasDetalleLotes: IVentaDetalleLote[];
}

export interface IVentaDetalleLote {

}

export interface INewVentaCabecera {
    // codventa: string;
    codalmacen: string;
    tipomovimiento: string;
    codempresa: string;
    codtipocliente: string;
    codcliente: string;
    codpaciente: string;
    nombre: string;
    cama: string;
    codmedico: string;
    codatencion: string;
    // codpresotor: string;
    codpoliza: string;
    planpoliza: string;
    deducible: number;
    codaseguradora: string;
    codcia: string;
    porcentajecoaseguro: number;
    porcentajeimpuesto: number;
    // montodctoplan: number;
    porcentajedctoplan: number;
    moneda: string;
    codplan: string;
    observacion: string;
    codcentro: string;
    nombremedico: string;
    nombreaseguradora: string;
    nombrecia: string;
    tipocambio: number;
    codpedido: string;
    nombrediagnostico: string;
    flagpaquete: string;
    flg_gratuito: boolean;
    nombremaquina: string;
    usuario?: string;
    listaVentaDetalle: INewVentaDetalle[];
    flgsinstock: boolean;
}

export interface INewVentaDetalle {
    codalmacen: string;
    manBtchNum: boolean;
    tipomovimiento: string;
    codproducto: string;
    nombreproducto: string;
    cantidad: number;
    precioventaPVP: number;
    valorVVP: number;
    stockalmacen: number;
    porcentajedctoproducto: number;
    porcentajedctoplan: number;
    montototal: number;
    montopaciente: number;
    montoaseguradora: number;
    codpedido: string;
    totalconigv: number;
    totalsinigv: number;
    gnc: string;
    codtipoproducto: string;
    preciounidadcondcto: number;
    igvproducto: number;
    narcotico: boolean;
    ventasDetalleDatos: INewVentaDetalleDato;
    nombretipoautorizacion: string;
    numerodocumentoautorizacion: string;
    flgbtchnum: boolean;
    listStockLote: IStock[];
    stockfraccion: number;
    cantidadpedido: number;
    u_SYP_CS_PRODCI: string;
}

export interface INewVentaDetalleDato {
    tipodocumentoautorizacion: string;
    numerodocumentoautorizacion: string;
}

export interface IVentaGenerado {
    codventa: string;
    codpresotor: string;
}

export interface IVentaCabeceraDatos {
    codventa: string;
    codalmacen: string;
    tipomovimiento: string;
    codcomprobante: string;
    codempresa: string;
    codtipocliente: string;
    codcliente: string;
    codpaciente: string;
    nombre: string;
    cama: string;
    codmedico: string;
    codatencion: string;
    codpresotor: string;
    codpoliza: string;
    planpoliza: string;
    deducible: number;
    codaseguradora: string;
    codcia: string;
    porcentajecoaseguro: number;
    porcentajeimpuesto: number;
    fechagenera: Date;
    fechaemision: Date;
    fechacancelacion: Date;
    fechaanulacion: Date;
    montodctoplan: number;
    porcentajedctoplan: number;
    moneda: string;
    montototal: number;
    montoigv: number;
    montoneto: number;
    codplan: string;
    montognc: number;
    montopaciente: number;
    montoaseguradora: number;
    observacion: string;
    codcentro: string;
    coduser: string;
    estado: string;
    nombremedico: string;
    nombreaseguradora: string;
    nombrecia: string;
    codventadevolucion: string;
    tipocambio: number;
    codpedido: string;
    usuarioanulacion: string;
    nombrediagnostico: string;
    flagpaquete: string;
    fecha_envio: string;
    fecha_entrega: Date;
    flg_gratuito: boolean;
    flg_enviosap: boolean;
    fec_enviosap: Date;
    ide_docentrysap: number;
    fec_docentrysap: Date;
    ide_tablaintersap: number;
    nombreestado: string;
    nombretipocliente: string;
    nombrealmacen: string;
    nombreplan: string;
    autorizado: string;
    codcomprobantee: string;
    tienedevolucion: string;
    ruccliente: string;
    dircliente: string;
    tipdocidentidad: string;
    docidentidad: string;
    nombretipdocidentidad: string;
    correocliente: string;
    moneda_comprobantes: string;
    numeroplanilla: string;
    listaVentaDetalle: IVentaDetalle[];
}

export interface ITipoAutorizacion {
    code: string;
    name: string;
}

export interface IHospitalDatos {
    codmedicoemergencia: string;
}

export interface IHospitalExclusiones {
    coddiagnostico: string;
    nombrediagnostico: string;
}

export interface IHospital {
    cama: string;
    codatencion: string;
    fechainicio: Date;
    codpaciente: string;
    codmedico: string;
    codpoliza: string;
    codaseguradora: string;
    planpoliza: string;
    polizaplan: string;
}

export interface IObservableLocal {
    observable: Observable<any>;
    nombreTabla: string;
}

export interface IAseguradoraxProducto {
    codaseguradora: string;
    codproducto: string;
    fec_registro: Date;
    cod_tipoatencion_mae: number;
}

export interface IConvenios {
    idconvenio: number;
    fechadocumento: Date;
    codalmacen: string;
    tipomovimiento: string;
    codtipocliente: string;
    codcliente: string;
    codpaciente: string;
    codaseguradora: string;
    codcia: string;
    codproducto: string;
    fechainicio: Date;
    fechafin: Date;
    excepto: boolean;
    tipomonto: string;
    monto: number;
    moneda: string;
    estado: boolean;
}

export interface ITipoCambio {
    currency: string;
    rateDate: Date;
    rate: number;
}

export interface IVentaCabeceraAnular {
    codventa: string;
    codpresotor: string;
    codatencion: string;
    codtipocliente: string;
    tipomovimiento: string;
    tienedevolucion: boolean;
    usuario?: string;
    motivoanulacion?: string;
}