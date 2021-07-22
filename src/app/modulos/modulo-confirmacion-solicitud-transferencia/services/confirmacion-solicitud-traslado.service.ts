import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { StringifyOptions } from 'querystring';

@Injectable({
  providedIn: 'root'
})
export class ConfirmacionSolicitudTrasladoService {

  constructor(
    private readonly http: HttpClient) { }

    //confirmacion

    setConfirmacionSolicitudTrasladoRegistrar(value: any) {
      return this.http.post(`${environment.url_api_requerimiento}/ConfirmacionSolicitudTransferencia/Post`, value );
    }
    
    getParamTransferecias(fechaInicio: any,fechaFin: any, idSolicitudTraslado: number,codAlmacenOrigen: string,codAlmacenDestino: string) {
      return this.http.get<any[]>(
        `${environment.url_api_requerimiento}/ConfirmacionSolicitudTransferencia/GetParam?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&idSolicitudTraslado=${idSolicitudTraslado}&codAlmacenOrigen=${codAlmacenOrigen}&codAlmacenDestino=${codAlmacenDestino}&interno=SI`);
    }
    //detalle
    getAtencionSolicitudTrasladoDetalle(idAtencionSolicitudTransferencia: number) {
      return this.http.get<any[]>(
        `${environment.url_api_requerimiento}/AtencionSolicitudTransferenciaItem/GetByIdAtencionSolicitudTransferencia?IdAtencionSolicitudTransferencia=${idAtencionSolicitudTransferencia}`);
    }

    
    getConfirmacionSolicitudTrasladoDetalle(idAtencionSolicitudTransferencia: number) {
      return this.http.get<any[]>(
        `${environment.url_api_requerimiento}/AtencionSolicitudTransferenciaItem/GetByIdAtencionSolicitudTransferencia?IdAtencionSolicitudTransferencia=${idAtencionSolicitudTransferencia}`);
    }

    getAllById(id: number) {
      return this.http.get<any[]>(
        `${environment.url_api_requerimiento}/ConfirmacionSolicitudTransferencia/GetAllById?IdConfirmacionSolicitudTransferencia=${id}`
      );
    }

    getLoteByItemCode(itemCode: string,codAlmacen: string) {
      return this.http.get<any[]>(
        `${environment.url_api_requerimiento}/Articulo/GetLoteByItemCode?ItemCode=${itemCode}&whsCode=${codAlmacen}`
      );
    }

    getArticuloVer(itemCode: string,whsCode: string) {
      return this.http.get<any[]>(
        `${environment.url_api_requerimiento}/Articulo/GetArticuloVer?itemCode=${itemCode}&whsCode=${whsCode}`);
    }

    postSapTrasladoStock(body: any) {
      return this.http.post(`${environment.url_api_requerimiento}/SapTrasladoStock/Post`, body);
    }

    getUbicacionByItemWhs(itemCode:String='',whsCode:String='') {
      return this.http.get<any[]>(
        `${environment.url_api_requerimiento}/SapUbicacion/getUbicacionByItemWhs?itemCode=${itemCode}&WhsCode=${whsCode}`
      );
    }

    //$http.get('/someUrl', config).then(successCallback, errorCallback);
    //detalle
    getAtencionSolicitudTrasladoDetalle2(idAtencionSolicitudTransferencia: number) {
      // return this.http.get<any[]>(
      //   `${environment.url_api_requerimiento}/AtencionSolicitudTransferenciaItem/GetByIdAtencionSolicitudTransferencia?IdAtencionSolicitudTransferencia=${idAtencionSolicitudTransferencia}`);
      return this.http.get(`${environment.url_api_requerimiento}/AtencionSolicitudTransferenciaItem/GetByIdAtencionSolicitudTransferencia?IdAtencionSolicitudTransferencia=${idAtencionSolicitudTransferencia}`);

    }

}
