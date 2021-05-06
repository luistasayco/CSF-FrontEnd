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

export interface ISeriePorMaquinaRegistrar {
    nombremaquina: string;
    seriefactura: string;
    serieboleta: string;
    serienotacredito: string;
    serienotadebito: string;
    serieguia: string;
    codcentro: string;
    codalmacen: string;
}

export interface ISeriePorMaquinaModificar {
    id: number;
    seriefactura: string;
    serieboleta: string;
    serienotacredito: string;
    serienotadebito: string;
    serieguia: string;
    codcentro: string;
    codalmacen: string;
}

export interface ISeriePorMaquinaEliminar {
    id: number;
}

export interface ISerie {
    tiposerie: string;
    tiposerienombre: string;
    serie: string;
    correlativo: string;
    flg_electronico: boolean;
    flg_otorgar: boolean;
    formato_electronico: string;
    key: string;
}

export interface ISerieRegistrar {
    tiposerie: string;
    serie: string;
    correlativo: string;
}

export interface ISerieEliminar {
    tiposerie: string;
    serie: string;
}