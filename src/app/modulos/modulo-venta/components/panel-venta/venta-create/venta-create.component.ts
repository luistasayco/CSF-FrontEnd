import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from '../../../../../services/breadcrumb.service';
import { GlobalsConstantsForm } from '../../../../../constants/globals-constants-form';
import { MenuItem, SelectItem } from 'primeng';
import { LanguageService } from '../../../../../services/language.service';
import { Router } from '@angular/router';
import { VentasService } from '../../../services/ventas.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { IWarehouses } from '../../../../modulo-compartido/Ventas/interfaces/warehouses.interface';
import { FormGroup, FormBuilder } from '@angular/forms';
import { IPaciente } from '../../../../modulo-compartido/Ventas/interfaces/paciente.interface';
import { ICliente } from '../../../../modulo-compartido/Ventas/interfaces/cliente.interface';
import { IPersonalClinica } from '../../../../modulo-compartido/Ventas/interfaces/personal-clinica.interface';
import { IMedico } from '../../../../modulo-compartido/Ventas/interfaces/medico.interface';
import { from, Subscription } from 'rxjs';
import { SessionService } from '../../../../../services/session.service';
import { VentaDataService } from '../../../services/venta-data.service';
import { ITipoAutorizacion, IHospitalExclusiones, IObservableLocal, IConvenios, INewVentaDetalle, INewVentaCabecera, ITipoCambio, IVentaGenerado } from '../../../interface/venta.interface';
import { PlanesModel } from '../../../models/planes.model';
import { IListarPedido } from '../../../../modulo-compartido/Ventas/interfaces/pedido-por-atencion.interface';
import { IReceta } from '../../../../modulo-compartido/Ventas/interfaces/receta.interface';
import { IProducto } from '../../../../modulo-compartido/Ventas/interfaces/producto.interface';
import { concatMap, finalize } from 'rxjs/operators';
import { VentaCompartidoService } from '../../../../modulo-compartido/Ventas/services/venta-compartido.service';
import { ITabla } from '../../../interface/tabla.interface';
import { UtilService } from '../../../../../services/util.service';
import { IStock } from '../../../../modulo-compartido/Ventas/interfaces/stock.interface';
import { IAutenticarResponse } from '../../../../modulo-compartido/Ventas/interfaces/autenticar.interface';
import { ISeriePorMaquina } from '../../../../modulo-compartido/Ventas/interfaces/serie-por-maquina.interface';
import { FunctionDblocalService } from '../../../../modulo-base-datos-local/function-dblocal.service';
import { ConstantsTablasIDB } from '../../../../modulo-base-datos-local/constants/constants-tablas-indexdb';
import swal from'sweetalert2';

@Component({
  selector: 'app-venta-create',
  templateUrl: './venta-create.component.html',
  styleUrls: ['./venta-create.component.css']
})
export class VentaCreateComponent implements OnInit {
  // Name de los botones de accion
  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm;

  // Opciones
  items: MenuItem[];

  listModelo: INewVentaDetalle[];
  listMedicosPorAtencion: SelectItem[];
  listTipoAutorizacion: SelectItem[];
  listHospitalExclusiones: IHospitalExclusiones[];

  columnas: any;

  isWarehouseCode: string;
  isAutenticar: boolean = false;
  isVisibleReceta: boolean = false;
  isVisiblePedido: boolean = false;
  isVisibleGenerico: boolean = false;
  isValidaMedicoEmergencia: number;
  isVisibleHospitalExcusiones: boolean;
  isHabilitaControlPlan: boolean = true;
  isCodPlan: string;
  // Formulario
  formularioCabecera: FormGroup;
  formularioTotales: FormGroup;

  // Tipo de Cliente
  isTipoCliente: string;
  // isCodAlmacen: string;

  isCodAseguradora: string;
  isCodContratante: string;
  isNegativo: boolean;
  isNoCubierto: string;

  // Mensaje
  isMensajePolizaBCR: string;
  isMensajeAviso: string;
  isTabObservacion: string;
  isGastosCubierto: boolean;
  isItem: IProducto;
  isModeloTablaValidaVentaTransferencia: ITabla;
  isListProductoRestringido: IProducto[];
  // isConvenios: IConvenios;
  isTipoCambio: number = 0;
  isTrabajaVariosIGV: boolean = false;
  isCodVenta: string;
  isFlgGeneroVenta: boolean;
  isDisplaySave: boolean;
  isDisplayValidacion: boolean = false;
  isNombreMaquina: string = '';

  subscription$: Subscription;

  // Visualizacion
  isVisualizarProducto: boolean = false;
  isVisualizarLote: boolean = false;

  isSeleccionItemVentaDetalle: INewVentaDetalle;
  isIndexItemVentaDetalle: number;

  isGrabar: boolean = false;
  constructor(private breadcrumbService: BreadcrumbService,
              public lenguageService: LanguageService,
              public router: Router,
              private readonly ventasService: VentasService,
              private readonly ventaDataService: VentaDataService,
              private readonly ventaCompartidoService: VentaCompartidoService,
              private readonly functionDblocalService: FunctionDblocalService,
              private sessionService: SessionService,
              private readonly fb: FormBuilder,
              public readonly messageService: MessageService,
              private readonly utilService: UtilService) {     
    this.breadcrumbService.setItems([
      { label: 'Módulo Venta' },
      { label: 'Venta', routerLink: ['module-ve/venta-create'] }
    ]);
  }

  ngOnInit(): void {
    // Contruye Formulario
    this.listModelo = [];
    this.isListProductoRestringido = [];
    // Inicializamos el valor
    this.isTrabajaVariosIGV = true;
    this.isCodVenta = 'XXXXXXXX';
    this.isFlgGeneroVenta = false;

    this.buildForm();
    this.buildFormTotales();

    this.goInicializaVariables();

    this.onOpcionesSplitButtonCabecera();

    this.onColumnasGrilla();
    
  }

  private buildForm() {
    this.formularioCabecera = this.fb.group({
      codAlmacen: [null],
      desAlmacen: [null],
      flggratuito: [false],
      fecha: [{value: new Date(), disabled: true}],
      tipoCambio: [{value: 0, disabled: false}],
      sinStock:[false],
      estado: ['GENERADO'],
      tipoCliente: ['01'],
      codAtencion: [null],
      codClienteExterno: [null],
      codPersonal: [null],
      codMedico: [null],
      listMedico: [null],
      paciente: [{value: null, disabled: false}],
      nombreClientePaciente: [{value: null, disabled: false}],
      direccion: [{value: null, disabled: true}],
      codAseguradora: [{value: null, disabled: false}],
      aseguradora: [{value: null, disabled: false}],
      plan: [{value: null, disabled: false}],
      descuentoPlan: [{value: 0, disabled: false}],
      coaseguro: [{value: 0, disabled: false}],
      titular: [{value: null, disabled: true}],
      poliza: [{value: null, disabled: false}],
      planPoliza: [{value: null, disabled: false}],
      codContratante: [{value: null, disabled: false}],
      contratante: [{value: null, disabled: false}],
      cama: [{value: null, disabled: false}],
      telefono: [{value: null, disabled: true}],
      codEmpresa: [{value: null, disabled: false}],
      empresa: [{value: null, disabled: false}],
      deducible: [{value: 0, disabled: false}],
      observacionPaciente: [null],
      observacionAtencion: [null],
      diagnostico: [null],
      medicoOtros: [null],
      observacionGeneral: [null],
      idegctipoatencionmae: [null],
      codpedido:[{value: null, disabled: false}],
      fecgenerapedido:[{value: null, disabled: false}]
    });
  }

  private buildFormTotales() {
    this.formularioTotales = this.fb.group({
      montoDescuentoPlan: [{value:0, disabled: true}],
      montoGNC: [{value:0, disabled: true}],
      montoSubTotal: [{value:0, disabled: true}],
      montoSubTotalPaciente: [{value:0, disabled: true}],
      montoSubTotalAseguradora: [{value:0, disabled: true}],
      montoIGV: [{value:0, disabled: true}],
      montoIGVPaciente: [{value:0, disabled: true}],
      montoIGVAseguradora: [{value:0, disabled: true}],
      montoTotal: [{value:0, disabled: true}],
      montoTotalPaciente: [{value:0, disabled: true}],
      montoTotalAseguradora: [{value:0, disabled: true}],
    });
  }

  private onOpcionesSplitButtonCabecera() {
    this.items = [
      {label: this.globalConstants.cConsultar, icon: this.globalConstants.icoConsultar,
        command: () => {
        this.onConsultarVenta();
      }},
      {label: this.globalConstants.cCaja, icon: this.globalConstants.icoCaja,
        command: () => {
        // this.update();
      }},
      {separator: true},
      {label: this.globalConstants.cGanancia, icon: this.globalConstants.icoGanancia,
        command: () => {
        // this.update();
      }},
      {label: this.globalConstants.cGenerico, icon: this.globalConstants.icoGenerico,
        command: () => {
        this.goGetProductosGenericos();
      }},
      {label: this.globalConstants.cSimulacion, icon: this.globalConstants.icoSimulacion,
        command: () => {
        // this.update();
      }},
      {label: 'Vale Delivery', icon: this.globalConstants.icoSimulacion,
        command: () => {
        // this.update();
      }},
      
    ];
  }

  private goInicializaVariables() {
    this.isTipoCliente = '01';
    this.goGetTipoAutorizacion();
    this.onObtieneEstacionTrabajo();
    this.onTipoCambio();
  }

  onObtieneEstacionTrabajo() {
    this.subscription$ = new Subscription();
    this.subscription$ = this.functionDblocalService.getByKey(ConstantsTablasIDB._TABLA_ESTACION_TRABAJO, 1)
    .subscribe((res: any) => {
        if (res !== undefined) {
          this.isNombreMaquina = res.nombreequipo;
          this.onObtieneConfiguracionEstacionTrabajo(res.nombreequipo);
        }
      },
      (error) => {
        swal.fire(this.globalConstants.msgErrorSummary, error.error.resultadoDescripcion ,'error')
      }
    );
  }

  onObtieneConfiguracionEstacionTrabajo(nombremaquina: string) {
    this.subscription$ = new Subscription();
    this.subscription$ = this.ventaCompartidoService.getListSeriePorMaquinaPorNombre(nombremaquina)
    .subscribe((res: ISeriePorMaquina[]) => {
      this.isWarehouseCode = res[0].codalmacen;
      this.formularioCabecera.patchValue({
        codAlmacen: this.isWarehouseCode
      });
      },
      (error) => {
        swal.fire(this.globalConstants.msgErrorSummary, error.error.resultadoDescripcion ,'error')
      }
    );
  }

  onTipoCambio(){
    this.subscription$ = new Subscription();
    this.subscription$ = this.ventasService.getGetObtieneTipoCambio()
    .subscribe((res: ITipoCambio[]) => {
      
      if (res.length === 0) {
        swal.fire(this.globalConstants.msgErrorSummary, 'Ingresar el tipo de cambio: Bancario Venta','error')
        return;
      }
      
      this.formularioCabecera.patchValue({
        tipoCambio: res[0].rate
      });

      },
      (error) => {
        swal.fire(this.globalConstants.msgErrorSummary, error.error.resultadoDescripcion ,'error')
      }
    );
  }

  goTipoClienteChange() {
    const {tipoCliente} = this.formularioCabecera.value;
    this.isTipoCliente = tipoCliente;

    this.goNuevaVenta(this.isTipoCliente);

    // Tipo Cliente Paciente
    if (this.isTipoCliente === '01') {
      this.formularioCabecera.controls.direccion.disable();
      this.isHabilitaControlPlan = true;
    }
    if (this.isTipoCliente !== '01') {
      this.formularioCabecera.controls.direccion.enable();
    }

    // Tipo Cliente Externo
    if (this.isTipoCliente === '02') {
      this.onPlanPorCodigo('00000002');
      this.isHabilitaControlPlan = false;
      this.isCodPlan = '00000002';
    }

    // Tipo Cliente Personal
    if (this.isTipoCliente === '03') {
      this.onPlanPorCodigo('00000001');
      this.isHabilitaControlPlan = true;
      this.isCodPlan = '00000001';
    }

    // Tipo Cliente Medíco
    if (this.isTipoCliente === '04') {
      this.onPlanPorCodigo('00000003');
      this.isHabilitaControlPlan = true;
      this.isCodPlan = '00000003';
    }

  }

  private onPlanPorCodigo(codplan: string) {
    this.subscription$ = new Subscription();
    this.subscription$ = this.ventasService.getPlanesbyCodigo(codplan)
    .subscribe((data: PlanesModel) => {
      this.formularioCabecera.patchValue({
        plan: data.codPlan,
        descuentoPlan: data.porcentajeDescuento,
        coaseguro: 0
      });
    });
  }

  goNuevaVenta(tipoCliente: string) {

    this.isCodPlan = null;
    this.isCodAseguradora = null;
    this.isCodContratante = null;
    this.isGrabar = false;
    this.formularioCabecera.patchValue({
      fecha: new Date(),
      sinStock:false,
      estado: 'GENERADO',
      tipoCliente: tipoCliente,
      codAtencion: null,
      codClienteExterno: null,
      codPersonal: null,
      codMedico: null,
      listMedico: null,
      paciente: null,
      nombreClientePaciente: null,
      direccion: null,
      codAseguradora: null,
      aseguradora: null,
      plan: null,
      descuentoPlan: 0,
      coaseguro: 0,
      titular: null,
      poliza: null,
      planPoliza: null,
      codContratante: null,
      contratante: null,
      cama: null,
      telefono: null,
      codEmpresa: null,
      empresa: null,
      deducible: 0,
      observacionPaciente: null,
      observacionAtencion: null,
      diagnostico: null,
      medicoOtros: null,
      observacionGeneral: null
    });

    this.formularioTotales.patchValue({
      montoDescuentoPlan: 0,
      montoGNC: 0,
      montoSubTotal: 0,
      montoSubTotalPaciente: 0,
      montoSubTotalAseguradora: 0,
      montoIGV: 0,
      montoIGVPaciente: 0,
      montoIGVAseguradora: 0,
      montoTotal: 0,
      montoTotalPaciente: 0,
      montoTotalAseguradora: 0,
    });

    this.listMedicosPorAtencion = [];

    this.listModelo = [];
  }

  goAlmacenSeleccionado(item: IWarehouses) {
    this.formularioCabecera.patchValue({
      codAlmacen: item.warehouseCode,
      desAlmacen: item.warehouseName
    });

    this.isWarehouseCode = item.warehouseCode;
  }

  goAtencionSeleccionado(item: IPaciente) {
    
    if (item.codatencion.substring(0,1) === 'J') {
      this.messageService.add({severity:'info', summary: this.globalConstants.msgInfoSummary, detail: 'A Pacientes con tipo de atención J, se vende como tipo cliente EXTERNO '});
      this.goNuevaVenta('01');
      return;
    }

    if (item.activo !== 1) {
      this.messageService.add({severity:'info', summary: this.globalConstants.msgInfoSummary, detail: 'Atención desactivada'});
      this.goNuevaVenta('01');
      return;
    }

    if (item.familiar === "S") {
      this.messageService.add({severity:'info', summary: this.globalConstants.msgInfoSummary, detail: 'No puede generar una venta a una atención familiar'});
      this.goNuevaVenta('01');
      return;
    }

    if (item.traslado === "S") {
      this.messageService.add({severity:'info', summary: this.globalConstants.msgInfoSummary, detail: 'No puede generar una venta a una atención que ha sido trasladada a otra. Consultar nueva atención...!!!'});
      this.goNuevaVenta('01');
      return;
    }

    this.formularioCabecera.patchValue({
      codAtencion: item.codatencion,
      paciente: item.codpaciente,
      nombreClientePaciente: item.nombrepaciente,
      direccion: item.direccion,
      coaseguro: item.coaseguro,
      codAseguradora: item.codaseguradora,
      aseguradora: item.nombreaseguradora,
      codContratante: item.codcia,
      contratante: item.nombrecontratante,
      titular: item.titular,
      poliza: item.poliza,
      plan: item.codplan,
      descuentoPlan: item.porcentajeplan,
      cama: item.cama,
      telefono: item.telefono,
      planPoliza: item.planpoliza,
      deducible: item.deducible,
      observacionPaciente: item.observacionespaciente,
      observacionAtencion: item.observacionatencion,
      idegctipoatencionmae: item.idegctipoatencionmae
    });

    this.isCodPlan = item.codplan;
    this.isCodAseguradora = item.codaseguradora;
    this.isCodContratante = item.codcia;

    this.onListMedicoPorAtencion (item.codatencion);

    if (item.poliza === '0019BCR*UNICA') {
      this.isMensajePolizaBCR = 'Póliza BCR';
    } else {
      this.isMensajePolizaBCR = '';
    }

    if (item.codcia === '0000382') {
      this.isMensajeAviso = 'Cia: CSF';
    } else {
      this.isMensajeAviso = '';
    }

    item.observacionatencion = item.observacionatencion === null ? '' : item.observacionatencion;
    item.observacionespaciente = item.observacionespaciente === null ? '' : item.observacionespaciente;

    if (item.observacionespaciente !== '' || item.observacionatencion !== '') {
      this.isMensajeAviso = 'Observación';
      this.isTabObservacion = "2";
    } else {
      this.isMensajeAviso = '';
      this.isTabObservacion = "1";
    }

    this.onHospitalExclusionesPorAtencion(item.codatencion);

  }

  private onHospitalExclusionesPorAtencion(codAtencion: string) {
    this.subscription$ = new Subscription();
    this.subscription$ = this.ventasService.getListHospitalExclusionesPorAtencion(codAtencion)
    .subscribe((data: IHospitalExclusiones[]) => {
      this.listHospitalExclusiones = data;
      if (data.length === 0) {
        this.messageService.add({severity:'info', summary: this.globalConstants.msgInfoSummary, detail: 'No cuenta con PRE-EXISTENCIA'});
      } else {
        this.isVisibleHospitalExcusiones = true;
      }
    });
  }

  goCerrarHospitalExclusiones() {
    this.isVisibleHospitalExcusiones = false;
  }

  private onListMedicoPorAtencion(codAtencion: string) {
    this.subscription$ = new Subscription();
    this.subscription$ = this.ventasService.getListMedicoPorAtencion(codAtencion)
    .subscribe((data: IMedico[]) => {
      this.listMedicosPorAtencion = [];
      for (let item of data) {
        this.listMedicosPorAtencion.push({ label: item.nombres, value: item.codmedico });
      }
    });
  }

  goClienteExternoSeleccionado(item: ICliente) {
    this.formularioCabecera.patchValue({
      codClienteExterno: item.cardCode,
      paciente: item.cardCode,
      nombreClientePaciente: item.cardName,
      telefono: item.phone1,
      direccion: item.mailAddress
    });
  }

  goPersonalClinicaSeleccionado(item: IPersonalClinica) {
    this.formularioCabecera.patchValue({
      codClienteExterno: item.codpersonal,
      codPersonal: item.codpersonal,
      paciente: item.codpersonal,
      nombreClientePaciente: item.apellido.trim() + ' ' + item.nombre.trim(),
      telefono: item.telefonocasa,
      direccion: item.direccion
    });

  }

  goMedicoSeleccionado(item: IMedico) {
    this.formularioCabecera.patchValue({
      codClienteExterno: item.codmedico,
      codPersonal: item.codmedico,
      paciente: item.codmedico,
      nombreClientePaciente: item.nombres,
      telefono: item.telefono,
      direccion: item.direccion
    });
  }

  goPlanSeleccionado(modelo: PlanesModel) {
    this.formularioCabecera.patchValue({
      plan: modelo.codPlan,
      descuentoPlan: modelo.porcentajeDescuento
    });
  }

  goProductoSeleccionado(item: IStock) {

    const bodyCabecera = this.formularioCabecera.value;

    this.subscription$ = new Subscription();
    this.subscription$ = this.ventaCompartidoService.getProductoPorCodigo(item.whsCode ,item.itemCode, bodyCabecera.codAseguradora ,bodyCabecera.codContratante, 'DV', this.isTipoCliente, '', bodyCabecera.paciente)
    .subscribe((data: IProducto) => {
      this.isItem = data;

      console.log('this.isItem ', this.isItem );

      if (this.isItem.flgrestringido) {
        swal.fire(this.globalConstants.msgInfoSummary,'Producto Restringido. Ver alternativo','error')
        return;
      }

      if (item.onHand_1 === 0) {
        swal.fire(this.globalConstants.msgInfoSummary,'Stock Negativo. Favor de revisar Producto','error')
        return;
      }

      if (item.u_SYP_CS_CLASIF !== null ) {
        if (item.u_SYP_CS_CLASIF === 'Alto riesgo' ) {

          swal.fire({  
            title: 'Esta por vender productos de ALTO RIESGO',
            text: '¿Desea seguir con la venta?',
            icon: 'question',
            showCancelButton: true,  
            confirmButtonText: 'SI',
            cancelButtonText: 'NO',
            showConfirmButton: true,
          }).then((result) => {  
            /* Read more about isConfirmed, isDenied below */  
              if (result.isConfirmed) {    
                this.onObtieneDetalleProducto(item);
              }
          });
        } else {
          this.onObtieneDetalleProducto(item);
        }
      } else {
        this.onObtieneDetalleProducto(item);
      }

    },
    (error) => {
      swal.fire(this.globalConstants.msgInfoSummary, error.error.resultadoDescripcion,'error')
      // this.messageService.add({severity:'info', summary: this.globalConstants.msgInfoSummary, detail: 'Producto Restringido. Ver alternativo'});
    });
  }

  private onListObservableProducto(codproducto: string) {

    const bodyCabecera = this.formularioCabecera.value;

    let itemObservable: IObservableLocal;
    let listObservable: IObservableLocal[] = [];

    itemObservable = { observable: this.ventasService.getGastoCubiertoPorFiltro(bodyCabecera.codAseguradora, codproducto, bodyCabecera.idegctipoatencionmae), nombreTabla: 'GastoCubierto' };
    listObservable.push(itemObservable);

    if ( bodyCabecera.codAseguradora === '0207' && bodyCabecera.codContratante === '0000382')
    {
      itemObservable = { observable: this.ventasService.getListProductoAlternativoPorCodigo( codproducto, bodyCabecera.codAseguradora, bodyCabecera.codContratante), nombreTabla: 'Producto Restringido' };
      listObservable.push(itemObservable);
    }

    return from(listObservable)
    .pipe(
      concatMap (id => id.observable)
    );
  }

  private onObtieneDetalleProducto(item: IStock) {
    let i: number = 0;

    this.onListObservableProducto(item.itemCode)
    .pipe(
      finalize( () => {   
        // Obtenermos los datos de la cabecera
        const bodyCabecera = this.formularioCabecera.value;

        // Declaramos variables
        let isProdNCxCia: boolean;


        if (this.isTipoCliente === '01') {
          if (bodyCabecera.idegctipoatencionmae !== null) {

            if (this.isGastosCubierto === false) {
              isProdNCxCia = true;

              swal.fire({
                title: 'No cubierto por Aseguradora',
                text: '¿Desea insertar de todas maneras?',
                icon: 'question',
                showCancelButton: true,  
                confirmButtonText: 'SI',
                cancelButtonText: 'NO',
                showConfirmButton: true,
              }).then((result) => {  
                /* Read more about isConfirmed, isDenied below */  
                  if (result.isConfirmed) {    
                    this.onInsertarProducto(item);
                  }
              });
            }
          } else {
            this.onInsertarProducto(item);
          }
        } else {this.onInsertarProducto(item);
        }
      }
    ))
    .subscribe( resp => {
      switch(i) {
        case 0:
          this.isGastosCubierto = resp
          break;
        case 1:
          this.isListProductoRestringido = resp;
          break;
      }
      i =  i + 1;
    },
    error => {
      swal.fire(this.globalConstants.msgInfoSummary, error.error.resultadoDescripcion,'error')
      // this.messageService.add({severity:'info', summary: this.globalConstants.msgInfoSummary, detail: error.error.resultadoDescripcion});
      return;
      }
    );    
  }

  private onInsertarProducto(item: IStock) {
    
    // let isProdNCxCia: string = 'N';
    let isProdNC: string = 'N';
    let isGNC: string = 'N';
    let isIngresar: boolean = false;
    // let isInsertando: boolean = true;
    let isGrupoArticulo: string = '';

    // Validamos si existe el producto
    let isExisteProducto = this.onValidaExisteProducto(item.itemCode);

    // Obtenermos los datos de la cabecera
    const bodyCabecera = this.formularioCabecera.value;

    if (isExisteProducto) {
      swal.fire(this.globalConstants.msgInfoSummary,'Producto ya fue ingresado. Favor de revisar Producto','error')
      return;
    }

    let isIgvProducto = this.onValidaIgvProducto(item.itemCode);

    if (isIgvProducto) {
      swal.fire(this.globalConstants.msgInfoSummary,'El IGV del producti es diferente al ya ingresado. Favor de revisar Producto','error')
      return;
    }
  
    isIngresar = true;

    switch (this.isItem.itemsGroupCode) {
      case 111:
        isGrupoArticulo = 'F';
        break;
      case 132:
        isGrupoArticulo = 'T';
        break;
      case 134:
        isGrupoArticulo = 'X';
        break;
      case 101:
        isGrupoArticulo = 'A';
        break;
      default:
        isGrupoArticulo = '';
        break;
    }

    if (this.isTipoCliente === '01') {
      if (bodyCabecera.idegctipoatencionmae !== null) {

        if (this.isGastosCubierto === false) {
          isGNC = 'S';
        } else {
          isGNC = 'N';
        }

        if(bodyCabecera.codAtencion !== null) {
          if(bodyCabecera.codAtencion.substring(0,1) === 'A') {
            isGNC = 'N';
          }
        }
      }
    } else {
      isGNC = isProdNC
    }

    if (isIngresar) {

      // Valor de Venta al Publico
      let isValorVVP: number = 0;
      // Valor de Precio Venta al publico
      let isValorPVP: number = 0;
      // Descuento del Producto
      let isValorDescuentoProducto: number = 0;
      // Descuento del Plan
      let isValorDescuentoPlan: number = 0;

      if (this.isItem.flgConvenio === true)
      {
        isValorVVP = this.isItem.valorVVP;
        isValorPVP = this.utilService.onRedondearDecimal((isValorVVP * (this.isItem.valorIGV / 100 + 1)),2);
      } else {
        isValorVVP = this.isItem.valorVVP;
        isValorPVP = this.isItem.valorPVP;
      }

      if (this.isListProductoRestringido.length > 0 ) {
        swal.fire(this.globalConstants.msgInfoSummary,'El producto se encuentra restringido. Favor de revisar','error')
      }

      if (this.isItem.u_SYP_MONART !== null ) {
        if (this.isItem.u_SYP_MONART === 'D' ) {
          isValorPVP = isValorPVP * this.isTipoCambio;
          isValorPVP = isValorPVP * this.isTipoCambio;
        }
      }

      if (this.isTipoCliente === '01') {
        isValorDescuentoProducto = 0;
        isValorDescuentoPlan = bodyCabecera.descuentoPlan;
      }

      if (this.isTipoCliente === '02' || this.isTipoCliente === '03' || this.isTipoCliente === '04') {
        isValorDescuentoProducto = this.isItem.valorDescuento;
        isValorDescuentoPlan = bodyCabecera.descuentoPlan;
      }

      const newDetalle: INewVentaDetalle  = {
        manBtchNum: this.isItem.manageBatchNumbers,
        codalmacen: bodyCabecera.codAlmacen,
        tipomovimiento: 'DV',
        codproducto: this.isItem.itemCode,
        nombreproducto: this.isItem.itemName,
        cantidad: 0,
        precioventaPVP: isValorPVP,
        valorVVP: isValorVVP,
        stockalmacen: 0,
        stockalm_fraccion: 0,
        porcentajedctoproducto: isValorDescuentoProducto,
        porcentajedctoplan: isValorDescuentoPlan,
        montototal: 0,
        montopaciente: 0,
        montoaseguradora: 0,
        codpedido: '',
        totalconigv: 0,
        totalsinigv: 0,
        gnc: isGNC,
        codtipoproducto: isGrupoArticulo,
        preciounidadcondcto: 0,
        igvproducto: this.isItem.valorIGV,
        narcotico: this.isItem.narcotico,
        ventasDetalleDatos: {
          tipodocumentoautorizacion: '00',
          numerodocumentoautorizacion: ''
        },
        numerodocumentoautorizacion: '',
        listStockLote: [], 
        flgbtchnum: false,
        stockfraccion: this.isItem.fraccionVenta
      }

      this.listModelo.push(newDetalle);

      isIngresar = false;
    }
  }

  // Validamos que si el producto existe en el detalle
  onValidaExisteProducto(itemcode: string) : boolean {

    let isExisteProducto: boolean = false;

    this.listModelo.forEach(element => {

      if (element.codproducto === itemcode) {
        isExisteProducto = true;
      }
    }); 

    return isExisteProducto;
  }

  onValidaIgvProducto(codproducto: string) : boolean {
    return false;
  }

  private onColumnasGrilla() {
    this.columnas = [
      { field: 'codproducto', header: 'Código' },
      { field: 'lote', header: 'Lote' },
      { field: 'nombreproducto', header: 'Descripción' },
      { field: 'cantidad', header: 'Cantidad' },
      { field: 'precioventaPVP', header: 'PVP' },
      { field: 'porcentajedctoproducto', header: 'Dscto. Prd.' },
      { field: 'porcentajedctoplan', header: 'Dscto. Plan' },
      { field: 'montopaciente', header: 'Monto Pac.' },
      { field: 'montoaseguradora', header: 'Monto Aseg.' },
      { field: 'valorVVP', header: 'VVP' },
      { field: 'totalsinigv', header: 'Total S/IGV' },
      { field: 'totalconigv', header: 'Total C/IGV' },
      { field: 'isGNC', header: 'No Cubierto' },
      { field: 'tipoAutorizacion', header: 'Tipo Autorización' },
      { field: 'numerodocumentoautorizacion', header: 'Nro Autorización' }
    ];
  }

  goChangeCantidad(item: INewVentaDetalle, index: number) {
    // Obtenermos los datos de la cabecera
    const bodyCabecera = this.formularioCabecera.value;

    let isCodPedido = bodyCabecera.codpedido === null || bodyCabecera.codpedido === undefined ? '' : bodyCabecera.codpedido;
    let isCoaseguro = bodyCabecera.coaseguro === null ? 0 : bodyCabecera.coaseguro;

    // Validamos cuando viene de un pedido
    if (this.isTipoCliente === '01' && isCodPedido.length === 14) {
      
    } else {
      // Validamos que cantidad de venta no sea mayor a lo que hay en stock
    }

    let isPrecioUnidadConDscto: number = 0;
    let isTemp: number = 0;
    let isMontoTotal: number = 0;
    let isMontoCoaseguro: number = 0;
    let isMontoSeguro: number = 0;
    let isMontoTotalIGV: number = 0;

    isPrecioUnidadConDscto = item.valorVVP - ((item.porcentajedctoproducto/100) * item.valorVVP);

    // Solo para farmacos
    if (this.isTipoCliente === '01' && item.codtipoproducto === 'A') {
      isPrecioUnidadConDscto = isPrecioUnidadConDscto - ((item.porcentajedctoplan/100) * isPrecioUnidadConDscto);
    } else {
      isPrecioUnidadConDscto = isPrecioUnidadConDscto - ((item.porcentajedctoplan/100) * isPrecioUnidadConDscto);
    }

    if (item.valorVVP > 0) {
      if (this.isTipoCliente === '01' && item.codtipoproducto === 'A') {
        isTemp = item.cantidad * isPrecioUnidadConDscto;
      } else {
        isTemp = item.cantidad * isPrecioUnidadConDscto;
      }
    }

    isMontoTotal = isTemp;

    switch (this.isTipoCliente) {
      case '01':
        isMontoCoaseguro = isMontoTotal * (isCoaseguro/100);
        isMontoSeguro = isMontoTotal - isMontoCoaseguro;
        break;
      case '02':
        isMontoCoaseguro = 0;
        isMontoSeguro = isMontoTotal;
        break;
      case '03':
        isMontoCoaseguro = 0;
        isMontoSeguro = isMontoTotal;
        break;
      case '04':
        isMontoCoaseguro = 0;
        isMontoSeguro = isMontoTotal;
        break;
    }

    isMontoTotalIGV = isMontoTotal * (1 + (this.isItem.valorIGV/100));

    this.listModelo[index].preciounidadcondcto = this.utilService.onRedondearDecimal(isPrecioUnidadConDscto,2);
    this.listModelo[index].montototal = this.utilService.onRedondearDecimal(isMontoTotal,2);
    this.listModelo[index].montoaseguradora = this.utilService.onRedondearDecimal(isMontoSeguro,2);
    this.listModelo[index].montopaciente = this.utilService.onRedondearDecimal(isMontoCoaseguro,2);
    this.listModelo[index].totalsinigv = this.utilService.onRedondearDecimal(isMontoTotal,2);
    this.listModelo[index].totalconigv = this.utilService.onRedondearDecimal(isMontoTotalIGV,2);

    this.onCalcularTotales();

  }

  private onCalcularTotales() {

    const bodyCabecera = this.formularioCabecera.value;

    let isIGVTemp: number = 0;
    let isIGV: number = 0;
    let isSubTotal: number = 0;
    let isTotalPaciente: number = 0;
    let isTotalAseguradora: number = 0;

    let isSubTotal_0: number = 0;
    let isTotalPaciente_0: number = 0;
    let isTotalAseguradora_0: number = 0;

    if (this.listModelo.length > 0) {
      this.listModelo.forEach(xfila => {
        isIGV = xfila.igvproducto;

        if (isIGV > isIGVTemp) {
          isIGVTemp = isIGV; 0
        }

        if (!this.isTrabajaVariosIGV) {
          isSubTotal = isSubTotal + xfila.totalsinigv;
          isTotalPaciente = isTotalPaciente + xfila.montopaciente;
          isTotalAseguradora = isTotalAseguradora + xfila.montoaseguradora;
        } else {
          if (isIGV === 0) {
            isSubTotal_0 = isSubTotal_0 + xfila.totalsinigv;
            isTotalPaciente_0 = isTotalPaciente_0 + xfila.montopaciente;
            isTotalAseguradora_0 = isTotalAseguradora_0 + xfila.montoaseguradora;
          } else {
            isSubTotal = isSubTotal + xfila.totalsinigv;
            isTotalPaciente = isTotalPaciente + xfila.montopaciente;
            isTotalAseguradora = isTotalAseguradora + xfila.montoaseguradora;
          }
        }
      })

      isIGV = isIGVTemp;

      if (!this.isTrabajaVariosIGV) { 
        this.formularioTotales.patchValue({

          montoDescuentoPlan: this.utilService.onRedondearDecimal(isSubTotal * (bodyCabecera.descuentoPlan/100),2),

          montoSubTotal: this.utilService.onRedondearDecimal(isSubTotal,2),
          montoIGV: this.utilService.onRedondearDecimal(isSubTotal * (isIGV/100),2),
          montoTotal: this.utilService.onRedondearDecimal(isSubTotal + (isSubTotal * (isIGV/100)),2),

          montoSubTotalPaciente: this.utilService.onRedondearDecimal(isTotalPaciente + (isTotalPaciente * (isIGV/100)),2),
          montoSubTotalAseguradora: this.utilService.onRedondearDecimal(isTotalAseguradora * (isTotalAseguradora * (isIGV/100)),2),

          montoIGVPaciente: this.utilService.onRedondearDecimal(isTotalPaciente * (isIGV/100),2),
          montoIGVAseguradora: this.utilService.onRedondearDecimal(isTotalAseguradora * (isIGV/100),2),

          montoTotalPaciente: this.utilService.onRedondearDecimal(isTotalPaciente,2),
          montoTotalAseguradora: this.utilService.onRedondearDecimal(isTotalAseguradora,2)
        });
      } 
      else 
      {
        this.formularioTotales.patchValue({

          montoDescuentoPlan: this.utilService.onRedondearDecimal(((isSubTotal + isSubTotal_0) * (bodyCabecera.descuentoPlan/100)) ,2),

          montoSubTotal: this.utilService.onRedondearDecimal(isSubTotal + isSubTotal_0,2),
          montoIGV: this.utilService.onRedondearDecimal(isSubTotal * (isIGV/100),2),
          montoTotal: this.utilService.onRedondearDecimal(isSubTotal + isSubTotal_0 + (isSubTotal * (isIGV/100)),2),

          montoSubTotalPaciente: this.utilService.onRedondearDecimal(isTotalPaciente + isTotalPaciente_0,2),
          montoSubTotalAseguradora: this.utilService.onRedondearDecimal(isTotalAseguradora + isTotalAseguradora_0,2),

          montoIGVPaciente: this.utilService.onRedondearDecimal(isTotalPaciente * (isIGV/100),2),
          montoIGVAseguradora: this.utilService.onRedondearDecimal(isTotalAseguradora * (isIGV/100),2),

          montoTotalPaciente: this.utilService.onRedondearDecimal(isTotalPaciente + isTotalPaciente_0 + (isTotalPaciente * (isIGV/100)),2),
          montoTotalAseguradora: this.utilService.onRedondearDecimal(isTotalAseguradora + isTotalAseguradora_0 + (isTotalAseguradora * (isIGV/100)),2)
        });
      }

    } else {
      this.formularioTotales.patchValue({

        montoDescuentoPlan: this.utilService.onRedondearDecimal((isSubTotal + isSubTotal_0) * (bodyCabecera.descuentoPlan/100),2),

        montoSubTotal: this.utilService.onRedondearDecimal(isSubTotal + isSubTotal_0,2),
        montoIGV: this.utilService.onRedondearDecimal(isSubTotal * (isIGV/100),2),
        montoTotal: this.utilService.onRedondearDecimal((isSubTotal + isSubTotal_0) + (isSubTotal * (isIGV/100)),2),

        montoSubTotalPaciente: this.utilService.onRedondearDecimal(isTotalPaciente + isTotalPaciente_0,2),
        montoSubTotalAseguradora: this.utilService.onRedondearDecimal(isTotalAseguradora + isTotalAseguradora_0,2),

        montoIGVPaciente: this.utilService.onRedondearDecimal(isTotalPaciente * (isIGV/100),2),
        montoIGVAseguradora: this.utilService.onRedondearDecimal(isTotalAseguradora * (isIGV/100),2),

        montoTotalPaciente: this.utilService.onRedondearDecimal(isTotalPaciente + isTotalPaciente_0 + (isTotalPaciente * (isIGV/100)),2),
        montoTotalAseguradora: this.utilService.onRedondearDecimal(isTotalAseguradora + isTotalAseguradora_0 + (isTotalAseguradora * (isIGV/100)),2)
      });
    }
  }

  private goGetTipoAutorizacion() {
    this.ventaDataService.getTipoAutorizacion().then((data: ITipoAutorizacion[]) => {
      this.listTipoAutorizacion = [];
      data.forEach(x => {
        this.listTipoAutorizacion.push({
          label: x.name,
          value: x.code
        });
      });
    });
  }

  goChangeTipoAutorizacion(data: any, index: number ) {
    this.listModelo[index].ventasDetalleDatos.tipodocumentoautorizacion =  data.value.value;
  }

  onConsultarVenta() {
    this.router.navigate(['/main/modulo-ve/panel-venta'])
  }

  goReceta() {

    // const body = this.formularioCabecera.value;

    // if (body.codAlmacen === null) {
    //   this.messageService.add({severity:'info', summary: this.globalConstants.msgInfoSummary, detail: 'Seleccione un Almacén'});
    //   return;
    // }

    this.isVisibleReceta =!this.isVisibleReceta;
  }

  goPedido() {

    // const body = this.formularioCabecera.value;

    // if (body.codAlmacen === null) {
    //   this.messageService.add({severity:'info', summary: this.globalConstants.msgInfoSummary, detail: 'Seleccione un Almacén'});
    //   return;
    // }

    this.isVisiblePedido = !this.isVisiblePedido;
  }

  goPedidoSeleccionado(modelo: IListarPedido) {
    console.log('IListarPedido', modelo);
    this.isVisiblePedido = !this.isVisiblePedido;
  }

  goPedidoCancelado() {
    this.isVisiblePedido = !this.isVisiblePedido;
  }

  goRecetaSeleccionado(modelo: IReceta) {
    console.log('IReceta', modelo);
    this.isVisibleReceta =!this.isVisibleReceta;
  }

  goRecetaCancelado() {
    this.isVisibleReceta =!this.isVisibleReceta;
  }

  goChangeVisibleProducto(event: INewVentaDetalle, index: number) {
    this.isSeleccionItemVentaDetalle = event;
    this.isIndexItemVentaDetalle = index;
    this.isVisualizarProducto =!this.isVisualizarProducto; 
  }

  goChangeVisibleLote(event: INewVentaDetalle, index: number) {
    this.isSeleccionItemVentaDetalle = event;
    this.isIndexItemVentaDetalle = index;
    this.isVisualizarLote =!this.isVisualizarLote; 
  }

  goSalirProducto() {
    this.isVisualizarProducto =!this.isVisualizarProducto; 
    this.isIndexItemVentaDetalle = 0;
  }

  goAceptarLote(value: IStock[]){
    this.isVisualizarLote =!this.isVisualizarLote; 

    this.listModelo[this.isIndexItemVentaDetalle].listStockLote = value;
    this.listModelo[this.isIndexItemVentaDetalle].cantidad = 0;
    
    let isCantidadTotal: number = 0;

    value.forEach(xFila => {
      if (xFila.quantityinput > 0) {
        isCantidadTotal += xFila.quantityinput;
      }
    });

    this.listModelo[this.isIndexItemVentaDetalle].cantidad = isCantidadTotal;

    if (isCantidadTotal === 0) {
      this.listModelo[this.isIndexItemVentaDetalle].flgbtchnum = false;
    } else {
      this.listModelo[this.isIndexItemVentaDetalle].flgbtchnum = true;
    }
    
    this.goChangeCantidad(this.listModelo[this.isIndexItemVentaDetalle], this.isIndexItemVentaDetalle);

  }

  goSalirLote() {
    this.isVisualizarLote =!this.isVisualizarLote; 
    this.isIndexItemVentaDetalle = 0;
  }

  goEliminarItemDetalleVenta(index: number) {
    this.listModelo.splice(+index, 1);
    this.onCalcularTotales();
  }

  goConfirmGrabar() {
    this.onValidacionGrabarVenta()
  }

  onValidacionGrabarVenta() {

    // debugger;

    this.isDisplayValidacion = true;

    const bodyCabecera = this.formularioCabecera.value;

    if (this.isFlgGeneroVenta) {
      this.isDisplayValidacion = false;
      swal.fire(this.globalConstants.msgInfoSummary,'Venta ya fue generada...Registro de Venta','error')
      return;
    }

    if (bodyCabecera.codAlmacen === '') {
      this.isDisplayValidacion = false;
      swal.fire(this.globalConstants.msgInfoSummary,'Seleccionar Almacén...Registro de Venta','error')
      return;
    }

    if (this.listModelo.length === 0) {
      this.isDisplayValidacion = false;
      swal.fire(this.globalConstants.msgInfoSummary,'No se encuentra registrado detalle','error')
      return;
    }

    if (bodyCabecera.tipoCambio === 0 || bodyCabecera.tipoCambio <= 0) {
      this.isDisplayValidacion = false;
      swal.fire(this.globalConstants.msgInfoSummary,'Ingresar el tipo de cambio: Bancario Venta','error')
      return;
    }

    let cadenaProductoCantidadCero: string = '';

    let cadenaProductoMontoCero: string = '';

    // Validamos que la cantidad y el monto del detalle no sean 0
    this.listModelo.forEach(xFila => {
      if (xFila.cantidad === 0) {
        cadenaProductoCantidadCero = cadenaProductoCantidadCero + `Producto: ${xFila.codproducto} - ${xFila.nombreproducto} <br>`;
      }

      if (xFila.totalconigv === 0) {
        cadenaProductoMontoCero = cadenaProductoMontoCero + `Producto: ${xFila.codproducto} - ${xFila.nombreproducto} <br>`;
      }
    });

    if (cadenaProductoCantidadCero !== '') {
      this.isDisplayValidacion = false;
      swal.fire("Productos con Cantidad 0", cadenaProductoCantidadCero,'error')
      return;
    }

    if (cadenaProductoMontoCero !== '') {
      this.isDisplayValidacion = false;
      swal.fire("Productos con Monto 0", cadenaProductoMontoCero,'error')
      return;
    }

    if (bodyCabecera.tipoCliente === '01') {

      if (bodyCabecera.codAtencion.length != 8) {
        this.isDisplayValidacion = false;
        swal.fire(this.globalConstants.msgInfoSummary, 'La atención no existe','error')
        return;
      }

      if (bodyCabecera.codAtencion.substring(0,1) === 'E' && bodyCabecera.codAseguradora === '00001') {
        this.isDisplayValidacion = false;
        swal.fire(this.globalConstants.msgInfoSummary, 'No se genera venta a atención particular de EMERGENCIA','error')
        return;
      }
      
      if (bodyCabecera.codAtencion.substring(0,1) === 'J') {
        this.isDisplayValidacion = false;
        swal.fire(this.globalConstants.msgInfoSummary, 'A Pacientes con tipo de atención J se vende como Tipo de Cliente EXTERNO','error')
        return;
      }

      if (bodyCabecera.observacionGeneral === '' || bodyCabecera.observacionGeneral === undefined || bodyCabecera.observacionGeneral === null ) {
        this.isDisplayValidacion = false;
        swal.fire(this.globalConstants.msgInfoSummary, 'Ingresar Observación','error')
        return;
      }

    }

    if (bodyCabecera.paciente === "") {
      this.isDisplayValidacion = false;
      swal.fire(this.globalConstants.msgInfoSummary, 'Atención sin Historial Clínica','error')
      return;
    }

    if (bodyCabecera.codpedido !== null) {
      if (bodyCabecera.codpedido.length === 14) {

        if (this.utilService.fecha_AAAAMMDD(bodyCabecera.fecgenerapedido) !== this.utilService.fecha_AAAAMMDD(new Date()) )
          this.isDisplayValidacion = false;
          swal.fire(this.globalConstants.msgInfoSummary, 'Solo se atienden pedido del dia de hoy','error')
          return;
      }
    }
   
    if (bodyCabecera.tipoCliente === '01') {
      if (bodyCabecera.listMedico === null) {
        this.isDisplayValidacion = false;
        swal.fire(this.globalConstants.msgInfoSummary, 'Ingrese el nombre del medico. El nombre del medico es un dato requerido','error')
        return;
      }
    }

    if (bodyCabecera.tipoCliente === '01' || bodyCabecera.tipoCliente === '02' || bodyCabecera.tipoCliente === '03' || bodyCabecera.tipoCliente === '04') {

      if (bodyCabecera.tipoCliente === '02') {
        if (bodyCabecera.codClienteExterno === '') {
          this.isDisplayValidacion = false;
          swal.fire(this.globalConstants.msgInfoSummary, 'Ingrese el codigo de cliente','error')
          return;
        }
      }

      if (bodyCabecera.tipoCliente === '03') {
        if (bodyCabecera.codClienteExterno === '') {
          this.isDisplayValidacion = false;
          swal.fire(this.globalConstants.msgInfoSummary, 'Ingrese el codigo de pesonal','error')
          return;
        }
      }

      if (bodyCabecera.tipoCliente === '04') {
        if (bodyCabecera.codClienteExterno === '') {
          this.isDisplayValidacion = false;
          swal.fire(this.globalConstants.msgInfoSummary, 'Ingrese el codigo de médico','error')
          return;
        }
      }
    }

    const bodyVenta = this.onGeneroBodyVenta('');

    this.subscription$ = new Subscription();
    this.subscription$  = this.ventasService.setValidacionRegistraVentaCabecera( bodyVenta )
    .subscribe(() =>  {
      this.isDisplayValidacion = false;

      if (this.listModelo.length === 0) {
        swal.fire(this.globalConstants.msgInfoSummary, 'No se encuentra registrado detalle de venta','error')
        return;
      }

      this.isAutenticar =!this.isAutenticar;
    },
      (error) => {
        this.isDisplayValidacion = false;
        swal.fire(this.globalConstants.msgErrorSummary,error.error.resultadoDescripcion, 'error')
    });
  }

  onGeneroBodyVenta(usuario: string): INewVentaCabecera {

    const bodyCabecera = this.formularioCabecera.value;

    const bodyVenta: INewVentaCabecera = {
      codalmacen: bodyCabecera.codAlmacen,
      tipomovimiento: 'DV',
      codempresa: bodyCabecera.codempresa,
      codtipocliente: bodyCabecera.tipoCliente,
      codcliente: bodyCabecera.codClienteExterno,
      codpaciente: bodyCabecera.paciente,
      nombre: bodyCabecera.nombreClientePaciente,
      cama: bodyCabecera.cama,
      codmedico: bodyCabecera.listMedico === null ? '': bodyCabecera.listMedico.value ,
      codatencion: bodyCabecera.codAtencion,
      codpoliza: bodyCabecera.poliza,
      planpoliza: bodyCabecera.planPoliza,
      deducible: bodyCabecera.deducible,
      codaseguradora: bodyCabecera.codAseguradora,
      codcia:  bodyCabecera.codContratante,
      porcentajecoaseguro: bodyCabecera.coaseguro,
      porcentajeimpuesto: 18,
      porcentajedctoplan: bodyCabecera.descuentoPlan,
      moneda: 'S',
      codplan:  bodyCabecera.plan,
      observacion:  bodyCabecera.observacionGeneral,
      codcentro:  '078',
      nombremedico:  bodyCabecera.listMedico === null ? '': bodyCabecera.listMedico.label,
      nombreaseguradora:  bodyCabecera.aseguradora,
      nombrecia: bodyCabecera.contratante,
      tipocambio: bodyCabecera.tipoCambio,
      codpedido: bodyCabecera.codpedido,
      nombrediagnostico: bodyCabecera.diagnostico,
      flagpaquete: 'N',
      flg_gratuito: bodyCabecera.flggratuito,
      nombremaquina: this.isNombreMaquina,
      listaVentaDetalle: this.listModelo,
      usuario: usuario
    }

    return bodyVenta;
  }

  onGrabar() {

    swal.fire({
      title: 'Generar Venta',
      text: "¿Desea Generar la Venta?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'No',
      confirmButtonText: 'Si'
    }).then((result) => {
      if (result.isConfirmed) {
        this.isAutenticar =!this.isAutenticar;
      }
    })
  }

  goAceptarGrabar(value: IAutenticarResponse) {

    this.isAutenticar =!this.isAutenticar;

    const bodyCabecera = this.formularioCabecera.value;


    if (!value.valido) {
      swal.fire(this.globalConstants.msgInfoSummary,value.observacion,'error')
      return;
    }

    if (bodyCabecera.codpedido !== null) {
      if (bodyCabecera.codpedido.length === 14) {

        if (this.utilService.fecha_AAAAMMDD(bodyCabecera.fecgenerapedido) !== this.utilService.fecha_AAAAMMDD(new Date()) )
          this.isDisplayValidacion = false;
          swal.fire(this.globalConstants.msgInfoSummary, 'Solo se atienden pedido del dia de hoy','error')
          return;
      }
    }

    const bodyVenta = this.onGeneroBodyVenta(value.usuario);

    bodyVenta.listaVentaDetalle.forEach(xFila => {
      if (xFila.ventasDetalleDatos !== null) {
        if (xFila.ventasDetalleDatos !== undefined) {
          if (xFila.ventasDetalleDatos.tipodocumentoautorizacion !== '00') {
            xFila.ventasDetalleDatos.numerodocumentoautorizacion = xFila.numerodocumentoautorizacion;
          }  
        }
      }
    });

    let isCadenaVentaGenerado: string = '';

    this.isDisplaySave = true;
    this.subscription$ = new Subscription();
    this.subscription$  = this.ventasService.setRegistrarVentaCabecera( bodyVenta )
    .subscribe((resp: IVentaGenerado[]) =>  {

      this.isDisplaySave = false;
      this.isGrabar = true;
      this.isCodVenta = '';
      resp.forEach(xFila => {
        isCadenaVentaGenerado = isCadenaVentaGenerado + `Ud. Genero correctamente la Venta ${xFila.codventa} <br>`;
        this.isCodVenta = this.isCodVenta +' , ' + xFila.codventa;
      });

      swal.fire(this.globalConstants.msgInfoSummary, isCadenaVentaGenerado, 'success');
    },
      (error) => {
        this.isDisplaySave = false;
        swal.fire(this.globalConstants.msgErrorSummary,error.error.resultadoDescripcion, 'error');
    });

  }

  goCancelarGrabar() {
    this.isAutenticar =!this.isAutenticar;
  }

  goGetProductosGenericos() {
    this.isVisibleGenerico =!this.isVisibleGenerico;
  }

}
