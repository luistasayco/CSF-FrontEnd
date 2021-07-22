import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { IDetalleRequerimieno, IGrilla, IMotivoRequerimiento, IAnexo, IRequerimientoAnexoModificar, IRequerimientoModificar } from '../../../models/requerimiento.interface';
import { FormGroup, FormBuilder } from '@angular/forms';
import { IConformidad } from '../../panel-requerimiento/modificar-requerimiento/modificar-requerimiento.component';
import { ActivatedRoute, Params } from '@angular/router';
import { RequerimientoService } from '../../../services/requerimiento.service';
import { Location } from '@angular/common';
import { UtilService } from '../../../../../services/util.service';
import { MensajePrimeNgService } from '../../../../../services/mensaje-prime-ng.service';
import { LanguageService } from '../../../../../services/language.service';
import { SessionService } from '../../../../../services/session.service';
import { map } from 'rxjs/operators';
import { ICentroCosto } from '../../../../modulo-administracion/models/aprobadorCentroCosto.interface';
import { ISocioNegocio } from '../../../../modulo-administracion/models/socio-negocio.interface';
import { interfaceUsuario } from '../../../../modulo-administracion/models/usuario.interface';
import { IArticulo, INewArticulo } from '../../../models/articulo.interface';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { IMensajeResultadoApi } from '../../../../modulo-compartido/Requerimiento/interfaces/mensajeRespuestaApi.interface';
import { UbicacionPorStockModel, UbicacionModel, UbicacionPorTipoProductoModel } from '../../../models/ubicacion.model';
import { GlobalsConstantsForm } from '../../../../../constants/globals-constants-form';
import { UserContextService } from '../../../../../services/user-context.service';

@Component({
  selector: 'app-modificar-requerimiento-economato',
  templateUrl: './modificar-requerimiento-economato.component.html',
  styleUrls: ['./modificar-requerimiento-economato.component.scss']
})
export class ModificarRequerimientoEconomatoComponent implements OnInit {
  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm();
  detalleDelItemSeleccionado: IDetalleRequerimieno;
  formularioSuperior: FormGroup;
  formularioFindArticulo: FormGroup;
  isActivateBusquedaArticulo = false;
  isActivateBusquedaUsuario = false;
  isActivateBusquedaCentroCosto = false;
  dataGrilla: IGrilla[] = [];
  indiceItemElegidoGrilla: IGrilla;
  opciones: any = [];
  modalBusqueda = false;
  modalRegistroRequerimiento = false;
  acomuladoDeitemQuitado: IGrilla[] = [];
  indiceModalCentroCosto: number;
  comboMotivo: IMotivoRequerimiento[];
  motivoSeleccionadoEnCombo: IMotivoRequerimiento;
  uploadedFiles: any[] = [];
  rowLineaRequerimientoAnexo: IAnexo[] = [];
  arrayUploadedFiles: any[] = [];
  arrayItemAnexosEliminados: IAnexo[] = [];
  fileLimit = 0;
  isEnvioArchivo = false;
  progress = 0;
  isMaxfilelimit = false;
  arrayComboConformidad: IConformidad[] = [];
  desRequerimientoEstado: string;

  isAprobadoDesaprobadoAnulado = false;
  isProcesadoSAP = false;
  isPendiente = false;
  isOcultarTablaEditar = false;
  isLoading = true;

  cols: any[];


  idRequerimiento: number;
  origen: string;

  indiceModalSocioNegocio: number;
  isActivateBusquedaSocioNegocio = false;

  //Ubicacion
  isActivateBusquedaUbicacion = false;
  itemUbicacionSeleccionado: UbicacionModel = new UbicacionModel();
  // Tipo Producto
  isActivateBusquedaTipoProducto = false;
  itemTipoProductoSeleccionado: UbicacionPorTipoProductoModel = new UbicacionPorTipoProductoModel();
  idUsuario: number;
  displayDescarga: boolean =false;
  // estadoRequerimiento: string;
  constructor(
    private readonly route: ActivatedRoute,
    private readonly requerimientoService: RequerimientoService,
    private readonly location: Location,
    private readonly fb: FormBuilder,
    private readonly utils: UtilService,
    public mensajePrimeNgService: MensajePrimeNgService,
    public lenguageService: LanguageService,
    private readonly sessionStorage: SessionService,
    private readonly cdRef: ChangeDetectorRef,
    private readonly userContextService: UserContextService
  ) {
    this.buildFormSuperior();
    this.buildFormFindArticulo();
  }

  ngOnInit(): void {
    this.storage();
    this.opcionesTabla();
    this.formatoTabla();
    this.route.params.subscribe((params: Params) => {
      this.idRequerimiento = params.id;
      this.origen = params.origen;
      this.getVerDetalle(this.idRequerimiento, this.origen);
    });
    this.comboPruebaConformidad();
    this.idUsuario = this.userContextService.getIdUsuario();
  }

  formatoTabla(){
    this.cols = [
      {field: 'opciones', header: 'Opciones'},
      {field: 'numLinea', header: 'Num Linea'},
      // {field: 'numOrdenTrabajo', header: 'Nro Orden Trabajo'},
      {field: 'codArticulo', header: 'Cod Articulo'},
      {field: 'desArticulo', header: 'Des Articulo'},
      {field: 'codUnidadMedida', header: 'Cod Unidad Medida'},
      // {field: 'codAlmacen', header: 'Cod Almacen'},
      {field: 'cantNecesaria', header: 'Cantidad Necesaria'},
      {field: 'codCentroCosto', header: 'Cod Centro Costo'},
      {field: 'codSocioNegocio', header: 'Cod Socio Negocio' },
      {field: 'fechaNecesaria', header: 'Fecha Necesaria'},
      {field: 'comentario', header: 'Comentario'}

    ]
  }

  storage() {
    if (this.sessionStorage.getItem('idRequerimiento')) {
      this.sessionStorage.removeItem('idRequerimiento');
    }
  }

  comboPruebaConformidad() {
    const array = [
      { id: 1, desOption: 'No' },
      { id: 2, desOption: 'Si' },
    ];
    this.arrayComboConformidad = array;
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  getVerDetalle(id: number, origen: string) {
    this.requerimientoService
      .getDetalleRequerimiento(id, origen)
      .pipe(
        map((resp) => {
          this.detalleDelItemSeleccionado = resp[0];
          this.desRequerimientoEstado = this.detalleDelItemSeleccionado.desRequerimientoEstado;
          this.dataGrilla = this.detalleDelItemSeleccionado.lineasRequerimientoItem;
          this.rowLineaRequerimientoAnexo = this.detalleDelItemSeleccionado.lineasRequerimientoAnexo;
          // console.log(this.rowLineaRequerimientoAnexo);

          this.fileLimit = this.limitFile(this.rowLineaRequerimientoAnexo);
          this.dataGrilla.forEach(
            (el) => (el.fecNecesaria = new Date(el.fecNecesaria))
          );

          this.agregarIndice(this.dataGrilla);
          this.formularioSuperior.patchValue({
            idTrabajador: this.detalleDelItemSeleccionado.idUsuario,
            trabajador: this.detalleDelItemSeleccionado.usuario,
            codCentroCosto: this.detalleDelItemSeleccionado.codCentroCosto,
            desCentroCosto: this.detalleDelItemSeleccionado.desCentroCosto,
            fechaReq: new Date(
              this.detalleDelItemSeleccionado.fecRequerimiento
            ),
            fechaNecesaria: new Date(
              this.detalleDelItemSeleccionado.fecNecesaria
            ),
            fechaValidez: new Date(this.detalleDelItemSeleccionado.fecValidez),
            observacion: this.detalleDelItemSeleccionado.observacion,
            proceSap: this.detalleDelItemSeleccionado.idSolicitudSAP,
          });

          this.formularioFindArticulo.patchValue({
            idUbicacion: this.detalleDelItemSeleccionado.idUbicacion,
            desUbicacion: this.detalleDelItemSeleccionado.desUbicacion
          });

          this.itemUbicacionSeleccionado.idUbicacion = this.detalleDelItemSeleccionado.idUbicacion;
          this.itemUbicacionSeleccionado.desUbicacion= this.detalleDelItemSeleccionado.desUbicacion;

          this.evaluarEstadoDeRequerimiento(
            this.detalleDelItemSeleccionado.idRequerimientoEstado
          );

          this.getMotivosRequerimiento();
        })
      )
      .subscribe(
        (resp) => resp,
        (error) => console.log,
        () => (this.isLoading = false)
      );
  }

  evaluarEstadoDeRequerimiento(estado: number) {
    if (estado === 3 || estado === 4 || estado === 6 || estado === 10 || estado === 9) {
      this.formularioSuperior.disable();
      this.isAprobadoDesaprobadoAnulado = true;
      this.isOcultarTablaEditar = true;
    }
    if (estado === 5) {
      this.isProcesadoSAP = true;
      this.isOcultarTablaEditar = true;
      this.formularioSuperior.disable();
      this.formularioSuperior.controls.conformidad.enable();
    }
    if (estado === 1) {
      this.isPendiente = true;
    }
  }

  limitFile(item: any[]): number {
    if (item.length + this.uploadedFiles.length === 0) {
      this.isMaxfilelimit = false;
      return 3;
    }
    if (item.length + this.uploadedFiles.length === 1) {
      this.isMaxfilelimit = false;
      return 2;
    }
    if (item.length + this.uploadedFiles.length === 2) {
      this.isMaxfilelimit = false;
      return 1;
    }
    if (item.length + this.uploadedFiles.length >= 3) {
      console.log(this.uploadedFiles);

      this.isMaxfilelimit = true;
      return 0;
    }
  }
  onClickRegresar() {
    this.location.back();
  }
  private buildFormSuperior() {
    this.formularioSuperior = this.fb.group({
      idTrabajador: [{value: null, disabled: true}],
      trabajador: [{value: null, disabled: true}],
      codCentroCosto: [{value: null, disabled: true}],
      desCentroCosto: [{value: null, disabled: true}],
      observacion: [null],
      motivo: [{value: null, disabled: true}],
      conformidad: [{ value: null, disabled: true }],
      fechaReq: [{value: null, disabled: true}],
      proceSap: [{value: null, disabled: true}],
      fechaNecesaria: [{value: null, disabled: true}],
      fechaValidez: [{value: null, disabled: true}],
    });
  }

  private buildFormFindArticulo() {
    this.formularioFindArticulo = this.fb.group({
      idUbicacion: [null],
      desUbicacion: [null],
      number: [null],
      groupName: [null]
    });
  }

  agregarIndice(data: IGrilla[]) {
    let n = 0;
    for (const i of data) {
      i.indice = n++;
    }
  }
  clickActivateBuscarArticulo() {
    this.isActivateBusquedaArticulo = !this.isActivateBusquedaArticulo;
  }
  clickActivateBuscarUsuario() {
    this.isActivateBusquedaUsuario = !this.isActivateBusquedaUsuario;
  }

  ubicacionSeleccionado(event: UbicacionModel) {
    this.itemUbicacionSeleccionado = event;
    this.formularioFindArticulo.patchValue({
      idUbicacion: event.idUbicacion,
      desUbicacion: event.desUbicacion,
    });

    this.activarModalUbicacion();
  }
  activarModalUbicacion() {
    this.isActivateBusquedaUbicacion = !this.isActivateBusquedaUbicacion;
  }

  tipoProductoSeleccionado(event: UbicacionPorTipoProductoModel) {
    this.itemTipoProductoSeleccionado = event;
    this.formularioFindArticulo.patchValue({
      number: event.codTipoProducto,
      groupName: event.desTipoProducto,
    });

    this.activarModalTipoProducto();
  }
  activarModalTipoProducto() {
    if (this.itemUbicacionSeleccionado) {
      this.isActivateBusquedaTipoProducto = !this.isActivateBusquedaTipoProducto;
    }
  }

  itemElegido(item) {
    // cuando doy click en el splitButton
    this.indiceItemElegidoGrilla = item;
  }
  opcionesTabla() {
    this.opciones = [
      {
        label: 'Quitar',
        icon: 'pi pi-trash',
        command: () => {
          this.quitarDeGrilla();
        },
      },
    ];
  }

  quitarDeGrilla() {
    this.quitarIndice(this.dataGrilla);
    if (this.dataGrilla[+this.indiceItemElegidoGrilla].idRequerimiento) {
      this.dataGrilla[+this.indiceItemElegidoGrilla].idEditForm = 2;
      this.dataGrilla[
        +this.indiceItemElegidoGrilla
      ].isRequerimientoItem = false;
      this.acomuladoDeitemQuitado.push(
        this.dataGrilla[+this.indiceItemElegidoGrilla]
      );
    }

    this.dataGrilla.splice(+this.indiceItemElegidoGrilla, 1);
    this.agregarIndice(this.dataGrilla);
  }

  activarModalBusqueda() {
    this.modalBusqueda = !this.modalBusqueda;
  }

  activarModalCentroCosto(indice?: number) {
    console.log(indice);
    this.indiceModalCentroCosto = indice;
    this.isActivateBusquedaCentroCosto = !this.isActivateBusquedaCentroCosto;
  }

  activarModalSocioNegocio(indice?: number) {
    console.log(indice);
    this.indiceModalSocioNegocio = indice;
    this.isActivateBusquedaSocioNegocio = !this.isActivateBusquedaSocioNegocio;
  }

  centroCostoSeleccionado(event: ICentroCosto) {
    this.dataGrilla[this.indiceModalCentroCosto].codCentroCosto =
      event.codCentroCosto;
    this.activarModalCentroCosto();
  }

  socioNegocioSeleccionado(event: ISocioNegocio) {
    this.dataGrilla[this.indiceModalSocioNegocio].codSocioNegocio =
      event.cardCode;
    this.activarModalSocioNegocio();
  }

  usuarioBuscado(event: interfaceUsuario) {
    this.clickActivateBuscarUsuario();
    this.formularioSuperior.patchValue({
      idTrabajador: event.idPersona,
      trabajador: event.nombresApellidos,
      codCentroCosto: event.codCentroCosto,
      desCentroCosto: event.desCentroCosto,
    });
  }

  articuloBuscado(event: UbicacionPorStockModel[]) {
    // Lista de articulos que seleccione en el POPUP
    this.cambioDeEstructuraDeArticulo_AddFechaNecesaria(event);
    this.clickActivateBuscarArticulo();
  }

  cambioDeEstructuraDeArticulo_AddFechaNecesaria(event: UbicacionPorStockModel[]) {
    const { fechaNecesaria, codCentroCosto } = this.formularioSuperior.getRawValue();
    for (const item of event) {
      const newArticulo: INewArticulo = {
        codArticulo: item.codArticulo,
        desArticulo: item.desArticulo,
        codUnidadMedida: item.salesUnit,
        codAlmacen: item.defaultWarehouse,
        fecNecesaria: fechaNecesaria,
        cantidadNecesaria: 1,
        codCentroCosto: codCentroCosto      
      };
      this.dataGrilla.push(newArticulo);
    }
    this.quitarIndice(this.dataGrilla);
    this.agregarIndice(this.dataGrilla);
  }
  
  clickGuardarGrilla(data: IGrilla[]) {
    this.quitarNumLineas(data);
    this.agregarNumLineas(data);
    data.forEach((el) => {
      el.fecNecesaria = this.utils.fechaApi_POST(new Date(el.fecNecesaria));
      el.cantidadNecesaria = +el.cantidadNecesaria;
      el.codAlmacen = el.codAlmacen ? el.codAlmacen : '';
      el.codUnidadMedida = el.codUnidadMedida ? el.codUnidadMedida : '';
      el.nroOrdenTrabajo = el.nroOrdenTrabajo ? el.nroOrdenTrabajo : '';
      el.isRequerimientoItem = true;
      el.comentario = el.comentario ? el.comentario : '';
      if (!el.idRequerimientoItem) {
        el.idEditForm = 3;
      }
    });
    // quitar los item que no se modifico
    data = data.filter((el) => el.idEditForm > 1);

    if (this.acomuladoDeitemQuitado.length > 0) {
      for (const i of this.acomuladoDeitemQuitado) {
        data.push(i);
      }
    }

    const {
      idTrabajador,
      fechaNecesaria,
      fechaReq,
      fechaValidez,
      codCentroCosto,
      observacion,
    } = this.formularioSuperior.getRawValue();

    const arrayAnexos: IRequerimientoAnexoModificar[] = [];
    this.arrayUploadedFiles.forEach((el) => {
      // console.log(el.name);
      const anexoData: IRequerimientoAnexoModificar = {
        idRequerimientoAnexo: 0,
        idEditForm: 3,
        numLinea: 1,
        // rutaAnexo: el.name,
        regUpdateIdUsuario: 11,
        isRequerimientoAnexo: true,
      };
      arrayAnexos.push(anexoData);
    });
    // Concatenando los anexos borrados
    const arrayAnexosEliminados: IRequerimientoAnexoModificar[] = [];
    this.arrayItemAnexosEliminados.forEach((el) => {
      const anexoData: IRequerimientoAnexoModificar = {
        idRequerimientoAnexo: el.idRequerimientoAnexo,
        idEditForm: 2,
        numLinea: 1,
        // rutaAnexo: el.rutaAnexo,
        regUpdateIdUsuario: 11,
        isRequerimientoAnexo: false,
      };
      arrayAnexosEliminados.push(anexoData);
    });
    const arrayFinalAnexo = arrayAnexos.concat(arrayAnexosEliminados);
    this.quitarIndice(this.dataGrilla);
    
    console.log('this.detalleDelItemSeleccionado', this.detalleDelItemSeleccionado);

    const { idUbicacion } = this.formularioFindArticulo.value;

    const bodyModificar: IRequerimientoModificar = {
      origen: '',
      idRequerimiento: this.detalleDelItemSeleccionado.idRequerimiento,
      fecRequerimiento: this.utils.fechaApi_POST(fechaReq),
      fecNecesaria: this.utils.fechaApi_POST(fechaNecesaria),
      fecValidez: this.utils.fechaApi_POST(fechaValidez),
      idUsuario: idTrabajador,
      codMotivoRequerimiento: this.motivoSeleccionadoEnCombo
        ? this.motivoSeleccionadoEnCombo.codMotivoRequerimiento
        : this.detalleDelItemSeleccionado.codMotivoRequerimiento,
      observacion: observacion ? observacion : '',
      codCentroCosto: codCentroCosto,
      regCreateIdUsuario: 0,
      idRequerimientoEstado: this.detalleDelItemSeleccionado.idRequerimientoEstado,
      lineasRequerimientoItem: data,
      idTipoRequerimiento: 2,
      lineasRequerimientoAnexo: arrayFinalAnexo,
      isAutorizado: this.detalleDelItemSeleccionado.isAutorizado,
      desAutorizado: this.detalleDelItemSeleccionado.desAutorizado,
      idUbicacion: idUbicacion
    };

    console.log('bodyModificar', bodyModificar);
    const apiFinal = JSON.stringify(bodyModificar);

    // this.guardarRequerimiento(bodyModificar);
    this.registerReq(apiFinal, this.uploadedFiles);

  }

  onAnexoEjecutar(id: number, nombreArchivo: string) {
    this.displayDescarga = true;
    this.requerimientoService.getGetObtieneArchivoById(id)
    .subscribe((resp: any) => {
      console.log('resp',resp);
      switch (resp.type) {
        case HttpEventType.DownloadProgress:
          // let progressStatus: ProgressStatus =
          // {status: ProgressStatusEnum.IN_PROGRESS, percentage: Math.round((resp.loaded / resp.total) * 100)};
          this.mensajePrimeNgService.onToInfoMsg(null,  'EN PROCESO');
          // this.downloadStatus.emit( {status: ProgressStatusEnum.IN_PROGRESS, percentage: Math.round((resp.loaded / resp.total) * 100)});
          break;
        case HttpEventType.Response:
          this.mensajePrimeNgService.onToInfoMsg(null, 'DESCARGA COMPLETA');
          saveAs(new Blob([resp.body], {type: resp.body.type}),nombreArchivo);
          // let file = new window.Blob([resp.body], {type: resp.body.type}, nombreArchivo);
          // let fileURL = window.URL.createObjectURL(file);
          // window.open(fileURL, '_blank');
          this.displayDescarga = false;
          break;
      }
    },
      (error) => {
        this.displayDescarga = false;
        this.mensajePrimeNgService.onToErrorMsg(null, error);
      });
  }

  registerReq(data, formData) {
    this.requerimientoService
      .modificarRequerimientoAprobador(data, formData)
      .subscribe(
        (event: HttpEvent<any>) => {
          switch (event.type) {
            case HttpEventType.Sent:
              this.isEnvioArchivo = true;
              console.log('Solicitud ha sido hecha!');
              break;
            case HttpEventType.ResponseHeader:
              console.log('Se ha recibido el encabezado de respuesta!');
              break;
            case HttpEventType.UploadProgress:
              this.progress = Math.round((event.loaded / event.total) * 100);
              console.log(`Uploaded! ${this.progress}%`);
              break;
            case HttpEventType.Response:
              this.isEnvioArchivo = false;
              console.log('Registro Exitoso', event.body);
              this.mensajePrimeNgService.onToExitoMsg(null, event.body);
              this.sessionStorage.setItem('idRequerimiento', event.body.idRegistro);
              setTimeout(() => {
                this.progress = 0;
                this.onClickRegresar();
              }, 1500);
          }
        },
        (error) => {
          this.isEnvioArchivo = false;
          this.progress = 0;
          this.mensajePrimeNgService.onToErrorMsg(null, error.error);
          console.log(error);
        }
      );
  }
  quitarNumLineas(data: IGrilla[]) {
    for (const i of data) {
      delete i.numLinea;
    }
  }

  quitarIndice(data: IGrilla[]) {
    for (const i of data) {
      delete i.indice;
    }
  }

  agregarNumLineas(data: IGrilla[]) {
    let n = 1;
    for (const i of data) {
      // if (i.idEditForm !== 2) {
      i.numLinea = n++;
      // }
    }
  }
  itemQueSeCambio(event) {
    const { indice } = event.data;
    if (event.data.idRequerimiento) {
      this.dataGrilla[indice].idEditForm = 2;
    }
  }

  guardarRequerimiento(body) {
    this.requerimientoService.updateRequerimiento(body).subscribe(
      (result: IMensajeResultadoApi) => {
        this.mensajePrimeNgService.onToExitoMsg(null, result);
        this.sessionStorage.setItem(
          'idRequerimiento',
          this.detalleDelItemSeleccionado.idRequerimiento
        );
        this.onClickRegresar();
      },
      (error) => {
        this.mensajePrimeNgService.onToErrorMsg(null, error.error);
        console.log(error);
      }
    );
  }
  
  getMotivosRequerimiento() {
    this.requerimientoService
      .getMotivoRequerimiento()
      .pipe(
        map((resp) => {
          this.comboMotivo = resp;
          const indice = this.comboMotivo.findIndex(
            (el) =>
              el.codMotivoRequerimiento ===
              this.detalleDelItemSeleccionado.codMotivoRequerimiento
          );
          this.formularioSuperior.patchValue({
            motivo: this.comboMotivo[indice],
          });
        })
      )
      .subscribe();
  }
  
  cambioEnComboMotivo(event: IMotivoRequerimiento) {
    this.motivoSeleccionadoEnCombo = event;
  }

  myUploader(event) {
    this.uploadedFiles = [];
    for (const file of event.files) {
      this.uploadedFiles.push(file);
    }
    this.arrayUploadedFiles = event.files;
    this.fileLimit = this.limitFile(this.rowLineaRequerimientoAnexo);
  }
  removeItemFile(event) {
    const indice = this.uploadedFiles.findIndex((el) => el == event.file);
    this.uploadedFiles.splice(indice, 1);
    this.fileLimit = this.limitFile(this.rowLineaRequerimientoAnexo);
  }
  quitarListaItemAnexo(indice) {
    this.rowLineaRequerimientoAnexo[indice].idEditForm = 2;
    this.arrayItemAnexosEliminados.push(
      this.rowLineaRequerimientoAnexo[indice]
    );

    this.rowLineaRequerimientoAnexo.splice(indice, 1);
    this.fileLimit = this.limitFile(this.rowLineaRequerimientoAnexo);
  }
  claseEstado(item: string): string {
    switch (item) {
      case 'APROBADO':
        return 'aprobado';
        break;
      case 'DESAPROBADO':
        return 'desaprobado';
        break;
      case 'PENDIENTE':
        return 'pendiente';
        break;
      case 'ANULADO':
        return 'anulado';
        break;
      case 'PROCESADO SAP':
        return 'procesadoSap';
        break;
        case 'LISTO APROBACIÓN':
          return 'listoAprobar';
          break;
      default:
        return null;
        break;
    }
  }
}
