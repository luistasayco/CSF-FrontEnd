import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { IResultBusquedaVenta, IVentaCabeceraSingle, IHospitalDatos, IHospitalExclusiones, IHospital } from '../interface/venta.interface';
import { UserContextService } from '../../../services/user-context.service';
import { VariablesGlobales } from '../../../interface/variables-globales';
import { PlanesModel } from '../models/planes.model';
import { IMedico } from '../../modulo-compartido/Ventas/interfaces/medico.interface';
import { UtilService } from '../../../services/util.service';
import { IResultBusquedaComprobante } from '../interface/comprobante.interface';
import { IResultBusquedaPedido } from '../interface/pedido.interface';
import { IVentaConfiguracion, IVentaConfiguracionRegistrar, IVentaConfiguracionModificar, IVentaConfiguracionEliminar } from '../interface/venta-configuracion.interface';
import { ISeriePorMaquina, ISeriePorMaquinaEliminar } from '../interface/serie-por-maquina.interface';
import { ITabla } from '../interface/tabla.interface';

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

  getVentasPorFiltro(codcomprobante: string, codventa: string, fecinicio: Date, fecfin: Date) {
    let parametros = new HttpParams();
    parametros = parametros.append('codcomprobante', codcomprobante);
    parametros = parametros.append('codventa', codventa);
    parametros = parametros.append('fecinicio', this.utils.fecha_AAAAMMDD(fecinicio));
    parametros = parametros.append('fecfin', this.utils.fecha_AAAAMMDD(fecfin));
    return this.http.get<IResultBusquedaVenta[]>
    (`${environment.url_api_venta}Venta/GetAll/`, { params: parametros });
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

  getListaComprobantesPorFiltro(codcomprobante: string, fecinicio: Date, fecfin: Date) {
    let parametros = new HttpParams();
    parametros = parametros.append('codcomprobante', codcomprobante);
    parametros = parametros.append('fecinicio', this.utils.fecha_AAAAMMDD(fecinicio));
    parametros = parametros.append('fecfin', this.utils.fecha_AAAAMMDD(fecfin));
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

  getPlanesbyCodigo(codigo: string) {
    let parametros = new HttpParams();
    parametros = parametros.append('codigo', codigo);
    return this.http.get<PlanesModel>
    (`${environment.url_api_venta}Planes/GetbyCodigo/`, { params: parametros });
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

  // Venta Configuracion
  getVentaConfiguracionGetByFiltros(nombre: string) {
    let parametros = new HttpParams();
    parametros = parametros.append('nombre', nombre);
    return this.http.get<IVentaConfiguracion[]>
    (`${environment.url_api_venta}VentaConfiguracion/GetByFiltros/`, { params: parametros });
  }

  setVentaConfiguracionRegistrar(value: IVentaConfiguracionRegistrar) {
    value = this.setAsignaValoresAuditabilidad<IVentaConfiguracionRegistrar>(value);
    console.log(value);
    const url = environment.url_api_venta + 'VentaConfiguracion/Registrar';
    const param: string = JSON.stringify(value);
    return this.http.post(
        url,
        param
    );
  }

  setVentaConfiguracionModificar(value: IVentaConfiguracionModificar) {
    value = this.setAsignaValoresAuditabilidad<IVentaConfiguracionModificar>(value);
    const url = environment.url_api_venta + 'VentaConfiguracion/Modificar';
    const param: string = JSON.stringify(value);
    return this.http.put(
        url,
        param
    );
  }

  setVentaConfiguracionEliminar(value: IVentaConfiguracionEliminar) {
    value = this.setAsignaValoresAuditabilidad<IVentaConfiguracionEliminar>(value);
    const url = environment.url_api_venta + 'VentaConfiguracion/Eliminar';
    const param: string = JSON.stringify(value);
    return this.http.patch(
        url,
        param
    );
  }

  // Serie Por Maquina
  getSeriePorMaquinaGetByFiltros(nombremaquina: string) {
    let parametros = new HttpParams();
    parametros = parametros.append('nombremaquina', nombremaquina);
    return this.http.get<ISeriePorMaquina[]>
    (`${environment.url_api_venta}SeriePorMaquina/GetListSeriePorMaquina/`, { params: parametros });
  }

  setSeriePorMaquinaRegistrar(value: ISeriePorMaquina) {
    value = this.setAsignaValoresAuditabilidad<ISeriePorMaquina>(value);
    console.log(value);
    const url = environment.url_api_venta + 'SeriePorMaquina/Registrar';
    const param: string = JSON.stringify(value);
    return this.http.post(
        url,
        param
    );
  }

  setSeriePorMaquinaModificar(value: ISeriePorMaquina) {
    value = this.setAsignaValoresAuditabilidad<ISeriePorMaquina>(value);
    const url = environment.url_api_venta + 'SeriePorMaquina/Modificar';
    const param: string = JSON.stringify(value);
    return this.http.put(
        url,
        param
    );
  }

  setSeriePorMaquinaEliminar(value: ISeriePorMaquinaEliminar) {
    value = this.setAsignaValoresAuditabilidad<ISeriePorMaquinaEliminar>(value);
    const url = environment.url_api_venta + 'SeriePorMaquina/Eliminar';
    const param: string = JSON.stringify(value);
    return this.http.patch(
        url,
        param
    );
  }

  // Tablas Clinica
  getTablasClinicaPorFiltros(codtabla: string, buscar: string, key: number, numerolineas: number, orden: number) {
    let parametros = new HttpParams();
    parametros = parametros.append('codtabla', codtabla);
    parametros = parametros.append('buscar', buscar);
    parametros = parametros.append('key', key.toString());
    parametros = parametros.append('numerolineas', numerolineas.toString());
    parametros = parametros.append('orden', orden.toString());
    return this.http.get<ITabla>
    (`${environment.url_api_venta}Tabla/GetTablasClinicaPorFiltros/`, { params: parametros });
  }

  // Lista Tablas Clinica
  getListTablaClinicaPorFiltros(codtabla: string, buscar: string, key: number, numerolineas: number, orden: number) {
    let parametros = new HttpParams();
    parametros = parametros.append('codtabla', codtabla);
    parametros = parametros.append('buscar', buscar);
    parametros = parametros.append('key', key.toString());
    parametros = parametros.append('numerolineas', numerolineas.toString());
    parametros = parametros.append('orden', orden.toString());
    return this.http.get<ITabla[]>
    (`${environment.url_api_venta}Tabla/GetListTablaClinicaPorFiltros/`, { params: parametros });
  }

  // Hospital Datos
  getHospitalDatosPorAtencion(codatencion: string) {
    let parametros = new HttpParams();
    parametros = parametros.append('codatencion', codatencion);
    return this.http.get<IHospitalDatos>
    (`${environment.url_api_venta}Hospital/GetHospitalDatosPorAtencion/`, { params: parametros });
  }

  getListHospitalExclusionesPorAtencion(codatencion: string) {
    let parametros = new HttpParams();
    parametros = parametros.append('codatencion', codatencion);
    return this.http.get<IHospitalExclusiones[]>
    (`${environment.url_api_venta}Hospital/GetListHospitalExclusionesPorAtencion/`, { params: parametros });
  }

  getListHospitalPacienteClinicaPorFiltros(pabellon: string, piso: string, local: string) {
    let parametros = new HttpParams();
    parametros = parametros.append('pabellon', pabellon);
    parametros = parametros.append('piso', piso);
    parametros = parametros.append('local', local);
    return this.http.get<IHospital[]>
    (`${environment.url_api_venta}Hospital/GetListHospitalPacienteClinicaPorFiltros/`, { params: parametros });
  }

  private setAsignaValoresAuditabilidad<T>(data: any): T{
    data.regIdUsuario = this.userContextService.getIdUsuario();
    // data.regEstacion = VariablesGlobales._DISPOSITIVO.nombreDispositivo;
    return data;
  }
}
