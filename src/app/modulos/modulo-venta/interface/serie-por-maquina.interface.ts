export interface ISeriePorMaquina {
    id: number;
    nombremaquina: string;
    seriefactura: string;
    serieboleta: string;
    serienotacredito: string;
    serienotadebito: string;
    serieguia: string;
    codcentro: string;
    descentro: string;
    codalmacen: string;
    desalmacen: string;
    serienotacreditofactura: string;
    serienotadebitofactura: string;
}

export interface ISeriePorMaquinaEliminar {
    id: number;
}