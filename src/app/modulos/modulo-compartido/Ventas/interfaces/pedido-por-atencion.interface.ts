export interface IPedidoPorAtencion {
    codpedido: string;
    fechaatencion: Date;
    estado: string;
    listado: string;
}

export interface IDetallePedidoPorPedido {
    codpro: string;
    despro: string;
    cantidadpedida: number;
    tipoproducto: string;
    codpedido: string;
}