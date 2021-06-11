import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { StringifyOptions } from 'querystring';

@Injectable({
  providedIn: 'root'
})
export class AtencionSolicitudTrasladoService {

  constructor(
    private readonly http: HttpClient) { }

    // getById(id: number) {
    //   return this.http.get<any[]>(
    //     `${environment.url_api_requerimiento}/AtencionSolicitudTransferencia/GetById?IdAtencionSolicitudTransferencia=${id}`
    //   );
    // }

    getAllById(id: number) {
      return this.http.get<any[]>(
        `${environment.url_api_requerimiento}/AtencionSolicitudTransferencia/GetAllById?IdAtencionSolicitudTransferencia=${id}`
      );
    }

    setAtencionSolicitudTrasladoRegistrar(value: any) {
      return this.http.post(`${environment.url_api_requerimiento}/AtencionSolicitudTransferencia/Post`, value );
    }

    anularAtencionSolicitud(body: any) {
      return this.http.put(`${environment.url_api_requerimiento}/AtencionSolicitudTransferencia/Anular`, body);
    }

    getSolicitudTrasladoDetalle(idSolicitudTraslado: number) {
      return this.http.get<any[]>(
        `${environment.url_api_requerimiento}/SolicitudTrasladoItem/GetByIdSolicitudTraslado?idSolicitudTraslado=${idSolicitudTraslado}`);
    }

    getAtencionSolicitudTrasladoDetalle(idAtencionSolicitudTransferencia: number) {
      return this.http.get<any[]>(
        `${environment.url_api_requerimiento}/AtencionSolicitudTransferenciaItem/GetByIdAtencionSolicitudTransferencia?IdAtencionSolicitudTransferencia=${idAtencionSolicitudTransferencia}`);
    }

    // atencion solicitud parametro
    getParamTransferecias(fechaInicio: any,fechaFin: any, idSolicitudTraslado: number,codAlmacenOrigen: string,codAlmacenDestino: string) {
      return this.http.get<any[]>(
        `${environment.url_api_requerimiento}/AtencionSolicitudTransferencia/GetParam?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&idSolicitudTraslado=${idSolicitudTraslado}&codAlmacenOrigen=${codAlmacenOrigen}&codAlmacenDestino=${codAlmacenDestino}`);
    }

    getSocioNegocioDirecciones(CardCode: string) {
      return this.http.get<any[]>(
        `${environment.url_api_requerimiento}/SocioNegocio/getDireccionBPCardCode?CardCode=${CardCode}`);
    }

    getSocioNegocioContactos(CardCode: string) {
      return this.http.get<any[]>(
        `${environment.url_api_requerimiento}/SocioNegocio/getContactosByBPCardCode?CardCode=${CardCode}`);
    }

}
