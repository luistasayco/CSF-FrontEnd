import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { IResultBusquedaVenta, IVentaCabeceraSingle } from '../interface/venta.interface';
import { UserContextService } from '../../../services/user-context.service';
import { VariablesGlobales } from '../../../interface/variables-globales';
import { PlanesModel } from '../models/planes.model';
import { IMedico } from '../../modulo-compartido/Ventas/interfaces/medico.interface';
import { UtilService } from '../../../services/util.service';
import { IResultBusquedaComprobante } from '../interface/comprobante.interface';
import { IResultBusquedaPedido } from '../interface/pedido.interface';

@Injectable({
  providedIn: 'root'
})
export class VentasService {

  constructor(private http: HttpClient,
              private userContextService: UserContextService,
              private utils: UtilService) { }

  // Ventas
  getTipoVenta() {
    return this.http.get<any>('assets/data/tipoventa.json')
                  .toPromise()
                  .then(res => res.data as any[])
                  .then(data => data);
  }

  getVentasPorFiltro(codcomprobante: string, codventa: string) {
    return this.http.get<IResultBusquedaVenta[]>
    (`${environment.url_api_venta}Venta/GetAll/?codcomprobante=${codcomprobante}&codventa=${codventa}`);
  }

  getListMedicoPorAtencion(codAtencion: string) {
    let parametros = new HttpParams();
    parametros = parametros.append('codAtencion', codAtencion);
    return this.http.get<IMedico[]>
    (`${environment.url_api_venta}Medico/GetListMedicoPorAtencion/`, { params: parametros });
  }

  getVentaPorCodVenta(codventa: string) {
    let parametros = new HttpParams();
    parametros = parametros.append('codventa', codventa);
    return this.http.get<IVentaCabeceraSingle>
    (`${environment.url_api_venta}Venta/GetVentaPorCodVenta/`, { params: parametros });
  }

  getVentaCabeceraPendientePorFiltro(fecha: Date) {
    let parametros = new HttpParams();
    parametros = parametros.append('fecha', this.utils.fecha_AAAAMMDD(fecha));
    return this.http.get<IResultBusquedaVenta[]>
    (`${environment.url_api_venta}Venta/GetVentaCabeceraPendientePorFiltro/`, { params: parametros });
  }

  getListaComprobantesPorFiltro(codcomprobante: string) {
    let parametros = new HttpParams();
    parametros = parametros.append('codcomprobante', codcomprobante);
    return this.http.get<IResultBusquedaComprobante[]>
    (`${environment.url_api_venta}Comprobante/getListaComprobantesPorFiltro/`, { params: parametros });
  }

  getListaPedidosSeguimientoPorFiltro(fechainicio: Date, fechaFin: Date, ccosto: string, opcion: number) {
    let parametros = new HttpParams();
    parametros = parametros.append('fechainicio', this.utils.fecha_AAAAMMDD(fechainicio));
    parametros = parametros.append('fechaFin', this.utils.fecha_AAAAMMDD(fechaFin));
    parametros = parametros.append('ccosto', ccosto);
    parametros = parametros.append('opcion', opcion.toString());
    return this.http.get<IResultBusquedaPedido[]>
    (`${environment.url_api_venta}Pedido/GetListaPedidosSeguimientoPorFiltro/`, { params: parametros });
  }

  //

  // Planes
  getPlanesGetByFiltros(value: PlanesModel) {
    let parametros = new HttpParams();
    parametros = parametros.append('nombre', value.nombre);
    return this.http.get<PlanesModel[]>
    (`${environment.url_api_venta}Planes/GetByFiltros/`, { params: parametros });
  }

  setPlanesRegistrar(value: PlanesModel) {
    value = this.setAsignaValoresAuditabilidad<PlanesModel>(value);
    console.log(value);
    const url = environment.url_api_venta + 'Planes/Registrar';
    const param: string = JSON.stringify(value);
    return this.http.post(
        url,
        param
    );
  }

  setPlanesModificar(value: PlanesModel) {
    value = this.setAsignaValoresAuditabilidad<PlanesModel>(value);
    const url = environment.url_api_venta + 'Planes/Modificar';
    const param: string = JSON.stringify(value);
    return this.http.put(
        url,
        param
    );
  }

  setPlanesEliminar(value: PlanesModel) {
    value = this.setAsignaValoresAuditabilidad<PlanesModel>(value);
    const url = environment.url_api_venta + 'Planes/Eliminar';
    const param: string = JSON.stringify(value);
    return this.http.patch(
        url,
        param
    );
  }

  private setAsignaValoresAuditabilidad<T>(data: any): T{
    data.regIdUsuario = this.userContextService.getIdUsuario();
    data.regEstacion = VariablesGlobales._DISPOSITIVO.nombreDispositivo;
    return data;
  }
}
