import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from '../../../../../services/breadcrumb.service';
import { GlobalsConstantsForm } from '../../../../../constants/globals-constants-form';
import { MenuItem, SelectItem } from 'primeng';
import { LanguageService } from '../../../../../services/language.service';
import { DemoService } from '../../../../../services/demo.service';
import { Router } from '@angular/router';
import { VentasService } from '../../../services/ventas.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { IWarehouses } from '../../../../modulo-compartido/Ventas/interfaces/warehouses.interface';
import { FormGroup, FormBuilder } from '@angular/forms';
import { IPaciente } from '../../../../modulo-compartido/Ventas/interfaces/paciente.interface';
import { ICliente } from '../../../../modulo-compartido/Ventas/interfaces/cliente.interface';
import { IPersonalClinica } from '../../../../modulo-compartido/Ventas/interfaces/personal-clinica.interface';
import { IMedico } from '../../../../modulo-compartido/Ventas/interfaces/medico.interface';
import { forkJoin, from, Subscription } from 'rxjs';
import { SessionService } from '../../../../../services/session.service';
import { VentaDataService } from '../../../services/venta-data.service';
import { ITipoAutorizacion, IHospitalExclusiones, IVentaDetalle, IObservableLocal, IConvenios, INewVentaDetalle } from '../../../interface/venta.interface';
import { MensajePrimeNgService } from '../../../../../services/mensaje-prime-ng.service';
import { PlanesModel } from '../../../models/planes.model';
import { IListarPedido } from '../../../../modulo-compartido/Ventas/interfaces/pedido-por-atencion.interface';
import { IReceta } from '../../../../modulo-compartido/Ventas/interfaces/receta.interface';
import { IProducto } from '../../../../modulo-compartido/Ventas/interfaces/producto.interface';
import { concatMap, finalize, map, mergeMap } from 'rxjs/operators';
import { VentaCompartidoService } from '../../../../modulo-compartido/Ventas/services/venta-compartido.service';
import { select } from '@ngrx/store';
import { ITabla } from '../../../interface/tabla.interface';

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
  isCodAlmacen: string;

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
  isTablaValidaVentaTransferencia: ITabla;
  isListProductoRestringido: IProducto[];
  isConvenios: IConvenios;

  subscription$: Subscription;

  constructor(private breadcrumbService: BreadcrumbService,
              public lenguageService: LanguageService,
              public router: Router,
              private demoService: DemoService,
              private readonly ventasService: VentasService,
              private readonly ventaDataService: VentaDataService,
              private readonly ventaCompartidoService: VentaCompartidoService,
              private confirmationService: ConfirmationService,
              private sessionService: SessionService,
              private readonly fb: FormBuilder,
              // public readonly mensajePrimeNgService: MensajePrimeNgService,
              public readonly messageService: MessageService) {     
    this.breadcrumbService.setItems([
      { label: 'Módulo Venta' },
      { label: 'Venta', routerLink: ['module-ve/venta-create'] }
    ]);
  }

  ngOnInit(): void {
    // Contruye Formulario
    this.listModelo = [];
    this.isListProductoRestringido = [];
    this.buildForm();
    this.buildFormTotales();

    this.goInicializaVariables();

    this.onOpcionesSplitButtonCabecera();

    this.onColumnasGrilla();
    this.goGetTipoAutorizacion();

    // this.demoService.getCarsLarge().then(cars => this.listModelo = cars);
  }

  private buildForm() {
    this.formularioCabecera = this.fb.group({
      codAlmacen: [null],
      desAlmacen: [null],
      flggratuito: [false],
      fecha: [{value: new Date(), disabled: true}],
      tipoCambio: [{value: 3.3233, disabled: true}],
      sinStock:[false],
      estado: ['GENERADO'],
      tipoCliente: ['01'],
      codAtencion: [null],
      codClienteExterno: [null],
      codPersonal: [null],
      codMedico: [null],
      listMedico: [null],
      paciente: [{value: null, disabled: false}],
      nombreClientePaciente: [{value: null, disabled: true}],
      direccion: [{value: null, disabled: true}],
      codAseguradora: [{value: null, disabled: false}],
      aseguradora: [{value: null, disabled: true}],
      plan: [{value: null, disabled: true}],
      descuentoPlan: [{value: 0, disabled: true}],
      coaseguro: [{value: 0, disabled: true}],
      titular: [{value: null, disabled: true}],
      poliza: [{value: null, disabled: true}],
      planPoliza: [{value: null, disabled: true}],
      codContratante: [{value: null, disabled: false}],
      contratante: [{value: null, disabled: true}],
      cama: [{value: null, disabled: true}],
      telefono: [{value: null, disabled: true}],
      codEmpresa: [{value: null, disabled: true}],
      empresa: [{value: null, disabled: true}],
      deducible: [{value: 0, disabled: true}],
      observacionPaciente: [null],
      observacionAtencion: [null],
      diagnostico: [null],
      medicoOtros: [null],
      observacionGeneral: [null],
      idegctipoatencionmae: [null]
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

    if (this.sessionService.getItem('estacion')) {
      let estacion = this.sessionService.getItem('estacion');
      this.isWarehouseCode = estacion.value.codalmacen;
    }
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
  }

  goAlmacenSeleccionado(item: IWarehouses) {
    this.formularioCabecera.patchValue({
      codAlmacen: item.warehouseCode,
      desAlmacen: item.warehouseName
    });

    this.isCodAlmacen = item.warehouseCode;
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
      codPersonal: item.codpersonal,
      paciente: item.codpersonal,
      nombreClientePaciente: item.apellido.trim() + ' ' + item.nombre.trim(),
      telefono: item.telefonocasa,
      direccion: item.direccion
    });

  }

  goMedicoSeleccionado(item: IMedico) {
    this.formularioCabecera.patchValue({
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

  goProductoSeleccionado(item: IProducto) {

    // Obtenermos los datos de la cabecera
    const bodyCabecera = this.formularioCabecera.value;

    if (item.flgrestringido) {
      this.messageService.add({severity:'info', summary: this.globalConstants.msgInfoSummary, detail: 'Producto Restringido. Ver alternativo'});
      return;
    }

    if (item.quantityOnStock === 0) {
      this.messageService.add({severity:'info', summary: this.globalConstants.msgInfoSummary, detail: 'Stock Negativo. Favor de revisar Producto'});
      return;
    }

    if (item.u_SYP_CS_CLASIF = 'Alto riesgo' ) {
      this.confirmationService.confirm({
        message: '¿Desea seguir con la venta?',
        header: 'Esta por vender productos de ALTO RIESGO',
        icon: 'pi pi-info-circle',
        acceptLabel: 'Si',
        rejectLabel: 'No',
        accept: () => {
          this.onObtieneDetalleProducto(item);
        },
        reject: () => {
          return;
        }
      });
    } else {
      this.onObtieneDetalleProducto(item);
    }
  }

  private onListObservableProducto(item: IProducto) {

    const bodyCabecera = this.formularioCabecera.value;

    let itemObservable: IObservableLocal;
    let listObservable: IObservableLocal[] = [];

    itemObservable = { observable: this.ventasService.getGastoCubiertoPorFiltro(bodyCabecera.codAseguradora, item.codproducto, bodyCabecera.idegctipoatencionmae), nombreTabla: 'GastoCubierto' };
    listObservable.push(itemObservable);

    itemObservable = { observable: this.ventaCompartidoService.getProductoPorCodigo(item.codproducto), nombreTabla: 'Producto' };
    listObservable.push(itemObservable);

    itemObservable = { observable: this.ventasService.getTablaLogisticaPorFiltros('VALIDARVENTATRANSFERENCIA', '02', 50, 1, -1), nombreTabla: 'Tabla' };
    listObservable.push(itemObservable);

    if (this.isTipoCliente === '01') {
      itemObservable = { observable: this.ventasService.getConveniosPorFiltros('', 'DV', this.isTipoCliente, '', bodyCabecera.paciente , bodyCabecera.codAseguradora ,bodyCabecera.codContratante, item.codproducto ), nombreTabla: 'Convenios' };
    } else {
      itemObservable = { observable: this.ventasService.getConveniosPorFiltros('', 'DV', this.isTipoCliente, '', '' , '' , '', item.codproducto ), nombreTabla: 'Convenios' };
    }
    listObservable.push(itemObservable);

    itemObservable = { observable: this.ventasService.getListProductoAlternativoPorCodigo( item.codproducto, bodyCabecera.codAseguradora, bodyCabecera.codContratante), nombreTabla: 'Producto Restringido' };
    listObservable.push(itemObservable);

    return from(listObservable)
    .pipe(
      concatMap (id => id.observable)
    );
  }

  private onObtieneDetalleProducto(item: IProducto) {
    let i: number = 0;

    this.onListObservableProducto(item)
    .pipe(
      finalize( () => { 
        console.log('Finalizo');    
        // Obtenermos los datos de la cabecera
        const bodyCabecera = this.formularioCabecera.value;

        // Declaramos variables
        let isProdNCxCia: boolean;
        // let isProdNC: boolean;
        let isCadenaVentaTranferencia: string = '';

        if (this.isTipoCliente === '01') {
          if (bodyCabecera.idegctipoatencionmae !== null) {

            if (this.isGastosCubierto === false) {
              isProdNCxCia = true;
              this.confirmationService.confirm({
                message: '¿Desea insertar de todas maneras?',
                header: 'No cubierto por Aseguradora',
                icon: 'pi pi-info-circle',
                acceptLabel: 'Si',
                rejectLabel: 'No',
                accept: () => {
                  if (this.isTablaValidaVentaTransferencia !== null) {
                    if (this.isTablaValidaVentaTransferencia.estado === 'G') {
              
                      // Validar que no tenga movimiento de transferencia
                      if (isCadenaVentaTranferencia !== '') {
                        this.messageService.add({severity:'info', summary: this.globalConstants.msgInfoSummary, detail: 'No puede realizar la venta del producto porque tiene Transferencia pendiente, por favor primero acepte las transferencia pendiente. Favor de revisar'});
                        return;
                      } else { 
                        this.onInsertarProducto(item.codproducto);
                      }
                    } else {
                      this.onInsertarProducto(item.codproducto);
                    }
                  } else {
                    this.onInsertarProducto(item.codproducto);
                  }
                },
                reject: () => {
                  return;
                }
              });
            }
          } else {
            if (this.isTablaValidaVentaTransferencia !== null) {
              if (this.isTablaValidaVentaTransferencia.estado === 'G') {
        
                // Validar que no tenga movimiento de transferencia
                if (isCadenaVentaTranferencia !== '') {
                  this.messageService.add({severity:'info', summary: this.globalConstants.msgInfoSummary, detail: 'No puede realizar la venta del producto porque tiene Transferencia pendiente, por favor primero acepte las transferencia pendiente. Favor de revisar'});
                  return;
                } else { 
                  this.onInsertarProducto(item.codproducto);
                }
              } else {
                this.onInsertarProducto(item.codproducto);
              }
            } else {
              this.onInsertarProducto(item.codproducto);
            }
          }
        } else {
          if (item.nocubierto === 'S') {
            this.confirmationService.confirm({
              message: '¿Desea insertar de todas maneras?',
              header: 'No cubierto por Aseguradora',
              icon: 'pi pi-info-circle',
              acceptLabel: 'Si',
              rejectLabel: 'No',
              accept: () => {
                if (this.isTablaValidaVentaTransferencia !== null) {
                  if (this.isTablaValidaVentaTransferencia.estado === 'G') {
            
                    // Validar que no tenga movimiento de transferencia
                    if (isCadenaVentaTranferencia !== '') {
                      this.messageService.add({severity:'info', summary: this.globalConstants.msgInfoSummary, detail: 'No puede realizar la venta del producto porque tiene Transferencia pendiente, por favor primero acepte las transferencia pendiente. Favor de revisar'});
                      return;
                    } else { 
                      this.onInsertarProducto(item.codproducto);
                    }
                  } else {
                    this.onInsertarProducto(item.codproducto);
                  }
                } else {
                  this.onInsertarProducto(item.codproducto);
                }
              },
              reject: () => {
                return;
              }
            });
          } else {

            if (this.isTablaValidaVentaTransferencia !== null) {
              if (this.isTablaValidaVentaTransferencia.estado === 'G') {
        
                // Validar que no tenga movimiento de transferencia
                if (isCadenaVentaTranferencia !== '') {
                  this.messageService.add({severity:'info', summary: this.globalConstants.msgInfoSummary, detail: 'No puede realizar la venta del producto porque tiene Transferencia pendiente, por favor primero acepte las transferencia pendiente. Favor de revisar'});
                  return;
                } else { 
                  this.onInsertarProducto(item.codproducto);
                }
              } else {
                this.onInsertarProducto(item.codproducto);
              }
            } else {
              this.onInsertarProducto(item.codproducto);
            }
          }
        }
      }
    ))
    .subscribe( resp => {
      switch(i) {
        case 0:
          this.isGastosCubierto = resp
          break;
        case 1:
          this.isItem = resp;
          break;
        case 2:
          this.isTablaValidaVentaTransferencia = resp;
          break;
        case 3:
          this.isConvenios = resp;
          break;
        case 4:
          this.isListProductoRestringido = resp;
          break;
      }
      i =  i + 1;
    },
    error => {
      this.messageService.add({severity:'info', summary: this.globalConstants.msgInfoSummary, detail: 'Error'});
      return;
      }
    );    
  }

  private onInsertarProducto(codproducto: string) {
    
    // let isProdNCxCia: string = 'N';
    let isProdNC: string = 'N';
    let isGNC: string = 'N';
    let isIngresar: boolean = false;
    // let isInsertando: boolean = true;
    let isGrupoArticulo: string = '';

    let isExisteProducto = this.onValidaExisteProducto(codproducto);

    // Obtenermos los datos de la cabecera
    const bodyCabecera = this.formularioCabecera.value;

    if (isExisteProducto) {
      this.messageService.add({severity:'info', summary: this.globalConstants.msgInfoSummary, detail: 'Producto ya fue ingresado. Favor de revisar Producto'});
      return;
    }

    let isIgvProducto = this.onValidaIgvProducto(codproducto);

    if (isIgvProducto) {
      this.messageService.add({severity:'info', summary: this.globalConstants.msgInfoSummary, detail: 'El IGV del producti es diferente al ya ingresado. Favor de revisar Producto'});
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

    if (this.isItem.nocubierto === 'S') {
      isProdNC = 'S';
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

      let isValorVVP: number = 0;
      let isPrecioVentaPVP: number = 0;
      let isIgv: number = 18;

      if (this.isConvenios !== null && this.isConvenios !== undefined)
      {
        if (this.isConvenios.tipomonto === 'M')
        {
          isValorVVP = this.isConvenios.monto;
          isPrecioVentaPVP = (isValorVVP * (isIgv / 100 + 1));
        } else {
          isValorVVP = this.isItem.avgStdPrice;
          isPrecioVentaPVP = this.isItem.avgStdPrice;
        }
      } else {
        isValorVVP = this.isItem.avgStdPrice;
        isPrecioVentaPVP = this.isItem.avgStdPrice;
      }

      if (this.isListProductoRestringido.length > 0 ) {
        this.messageService.add({severity:'info', summary: this.globalConstants.msgInfoSummary, detail: 'El producto se encuentra restringido. Favor de revisar'});
      }

      const newDetalle: INewVentaDetalle  = {
        codalmacen: bodyCabecera.codalmacen,
        tipomovimiento: 'DV',
        codproducto: this.isItem.codproducto,
        cantidad: 0,
        preciounidadcondcto: this.isItem.avgStdPrice,
        precioventaPVP: this.isItem.avgStdPrice,
        valorVVF: isValorVVP,
        valorVVP: this.isItem.avgStdPrice,
        stockalmacen: 0,
        porcentajedctoproducto: 0,
        montototal: 0,
        montopaciente: 0,
        montoaseguradora: 0,
        promedio: 0,
        gnc: '',
        codpedido: '',
        nombreproducto: this.isItem.itemName,
        porcentajedctoplan: 0,
        porcentajecoaseguro: 0,
        valor_dscto: 0,
        moneda: this.isItem.u_SYP_MONART
      }

      this.listModelo.push(newDetalle);
    }
  }

  // Validamos que si el producto existe en el detalle
  onValidaExisteProducto(codproducto: string) : boolean {

    let isExisteProducto: boolean = false;

    this.listModelo.forEach(element => {

      if (element.codproducto === codproducto) {
        isExisteProducto = true;
      }
    }); 

    return isExisteProducto;
  }

  onValidaIgvProducto(codproducto: string) : boolean {
    return false;
  }

  // private goGetGastoCubiertoPorFiltro(codaseguradora: string, codproducto: string, tipoatencion: number) {
  //   this.subscription$ = new Subscription();
  //   this.subscription$ = this.ventasService.getGastoCubiertoPorFiltro(codaseguradora, codproducto, tipoatencion)
  //   .subscribe(resp => {
  //     this.isGastosCubierto = resp;
  //   });
  // }

  // private goGetProductoPorCodigo(codproducto: string) {
  //   this.subscription$ = new Subscription();
  //   this.subscription$ = this.ventaCompartidoService.getProductoPorCodigo(codproducto)
  //   .subscribe(resp => {
  //     this.isItem = resp;
  //   });
  // }

  private onColumnasGrilla() {
    this.columnas = [
      { field: 'codproducto', header: 'Código' },
      { field: 'lote', header: 'Lote' },
      { field: 'descripcion', header: 'Descripción' },
      { field: 'cantidad', header: 'Cantidad' },
      { field: 'pvp', header: 'PVP' },
      { field: 'dctoProd', header: 'Dscto. Prd.' },
      { field: 'dctoPlan', header: 'Dscto. Plan' },
      { field: 'montoPac', header: 'Monto Pac.' },
      { field: 'montoAseg', header: 'Monto Aseg.' },
      { field: 'costoVVF', header: 'Costo VVF' },
      // { field: 'precioUnid', header: 'Precio Uni.' },
      { field: 'vvp', header: 'VVP' },
      { field: 'totalSigv', header: 'Total S/IGV' },
      { field: 'totalCigv', header: 'Total C/IGV' },
      // { field: 'igvProd', header: 'IGV Prod' },
      { field: 'noCubierto', header: 'No Cubierto' },
      // { field: 'nroPedido', header: 'NroPedido' },
      { field: 'tipoAutorizacion', header: 'Tipo Autorización' },
      { field: 'nroAutorizacion', header: 'Nro Autorización' },
      // { field: 'tipoProducto', header: 'Tipo Prod.' }
    ];
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
    // this.listModelo[index].tipoAutorizacion =  data.value.value;
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

  onConfirmGrabar() {
    this.confirmationService.confirm({
        message: this.globalConstants.subTitleGrabar,
        header: this.globalConstants.titleGrabar,
        icon: 'pi pi-info-circle',
        acceptLabel: 'Si',
        rejectLabel: 'No',
        accept: () => {
          this.isAutenticar = true;
        },
        reject: () => {
          // this.mensajePrimeNgService.onToCancelMsg(this.globalConstants.msgCancelSummary, this.globalConstants.msgCancelDetail);
        }
    });
  }

  goGetProductosGenericos() {
    this.isVisibleGenerico =!this.isVisibleGenerico;
  }

}
