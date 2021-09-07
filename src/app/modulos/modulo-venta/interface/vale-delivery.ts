export interface IValeDelivery{
    idvaledelivery: number;
    ide_receta?: number;
    codventa?: string;
    codatencion: string;
    nombrepaciente: string;
    telefono: string;
    celular: string;
    direccion: string;
    distrito: string;
    referencia: string;
    fechaentrega: Date;
    lugarentrega: string;
    prioridad_1: string;
    prioridad_2: string;
    estado: boolean;
    estadovd?: string;
}