import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IGrupoArticulo } from '../interfaces/grupo-articulo.interface';
import { environment } from 'src/environments/environment';
import { IServicio } from '../interfaces/servicio.interface';
import { IDimension } from '../../../modulo-administracion/models/aprobadorCentroCosto.interface';

@Injectable({
  providedIn: 'root'
})
export class RequerimientoCompartidoService {

  constructor(private http: HttpClient) { }

  getGrupoArticulo(next: number) {
    let parametros = new HttpParams();
    parametros = parametros.append('next', next.toString());
    return this.http.get<IGrupoArticulo[]>(`${environment.url_api_requerimiento}/GrupoArticulo/Get/`, { params: parametros });
  }

  getServicio() {
    return this.http.get<IServicio[]>(`${environment.url_api_requerimiento}/Servicio/Get`);
  }
}
