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
    cantidad_fraccion: number;
    preciounidadcondcto: number;
    precioventaPVP: number;
    valorVVF: number;
    valorVVP: number;
    stockalmacen: number;
    stockalm_fraccion: number;
    porcentajedctoproducto: number;
    montototal: number;
    montopaciente: number;
    montoaseguradora: number;
    fechagenera: Date;
    stockfraccion: number;
    costocompra: number;
    promedio: number;
    estado: string;
    gnc: string;
    codpedido: string;
    cant_traentcon: number;
    cant_deventcon: number;
    cant_tramencon: number;
    cant_devmencon: number;
    promediomn: number;
    nombreproducto: string;
    porcentajedctoplan: number;
    porcentajecoaseguro: number;
    valor_dscto: number;
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