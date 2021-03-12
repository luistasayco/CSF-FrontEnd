import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IWarehouses } from '../interfaces/warehouses.interface';
import { environment } from 'src/environments/environment.prod';
import { IPaciente } from '../interfaces/paciente.interface';
import { ICliente } from '../interfaces/cliente.interface';
import { IPersonalClinica } from '../interfaces/personal-clinica.interface';
import { IMedico } from '../interfaces/medico.interface';
import { IAtencion } from '../interfaces/atencion.interface';

@Injectable({
  providedIn: 'root'
})
export class VentaCompartidoService {

  constructor(private http: HttpClient) { }

  getListWarehousesContains(warehouseName: string) {
    let parametros = new HttpParams();
    parametros = parametros.append('warehouseName', warehouseName);
    return this.http.get<IWarehouses[]>
    (`${environment.url_api_venta}Warehouses/GetListWarehousesContains/`, { params: parametros });
  }

  getListPacientePorFiltros(opcion: string, codpaciente: string, nombres: string) {
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', opcion);
    parametros = parametros.append('codpaciente', codpaciente);
    parametros = parametros.append('nombres', nombres);
    return this.http.get<IAtencion[]>
    (`${environment.url_api_venta}Atencion/GetListPacientePorFiltros/`, { params: parametros });
  }

  getPacientePorAtencion(codAtencion: string) {
    let parametros = new HttpParams();
    parametros = parametros.append('codAtencion', codAtencion);
    return this.http.get<IPaciente>
    (`${environment.url_api_venta}Paciente/GetPacientePorAtencion/`, { params: parametros });
  }

  getListClientePorFiltro(opcion: string, ruc: string, nombre: string) {
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', opcion);
    parametros = parametros.append('ruc', ruc);
    parametros = parametros.append('nombre', nombre);
    return this.http.get<ICliente[]>
    (`${environment.url_api_venta}Cliente/GetListClientePorFiltro/`, { params: parametros });
  }

  getListPersonalClinicaPorNombre(nombre: string) {
    let parametros = new HttpParams();
    parametros = parametros.append('nombre', nombre);
    return this.http.get<IPersonalClinica[]>
    (`${environment.url_api_venta}PersonalClinica/GetListPersonalClinicaPorNombre/`, { params: parametros });
  }

  getListMedicoPorNombre(nombre: string) {
    let parametros = new HttpParams();
    parametros = parametros.append('nombre', nombre);
    return this.http.get<IMedico[]>
    (`${environment.url_api_venta}Medico/GetListMedicoPorNombre/`, { params: parametros });
  }
}
