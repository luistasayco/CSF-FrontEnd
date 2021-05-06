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
import { Subscription } from 'rxjs';
import { SessionService } from '../../../../../services/session.service';
import { VentaDataService } from '../../../services/venta-data.service';
import { ITipoAutorizacion, IHospitalExclusiones } from '../../../interface/venta.interface';
import { MensajePrimeNgService } from '../../../../../services/mensaje-prime-ng.service';
import { PlanesModel } from '../../../models/planes.model';
import { IListarPedido } from '../../../../modulo-compartido/Ventas/interfaces/pedido-por-atencion.interface';
import { IReceta } from '../../../../modulo-compartido/Ventas/interfaces/receta.interface';
import { IProducto } from '../../../../modulo-compartido/Ventas/interfaces/producto.interface';

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

  listModelo: any[];
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

  // Mensaje
  isMensajePolizaBCR: string;
  isMensajeAviso: string;
  isTabObservacion: string;

  subscription$: Subscription;

  constructor(private breadcrumbService: BreadcrumbService,
              public lenguageService: LanguageService,
              public router: Router,
              private demoService: DemoService,
              private readonly ventasService: VentasService,
              private readonly ventaDataService: VentaDataService,
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
    this.buildForm();
    this.buildFormTotales();

    this.goInicializaVariables();

    this.onOpcionesSplitButtonCabecera();

    this.onColumnasGrilla();
    this.goGetTipoAutorizacion();

    this.demoService.getCarsLarge().then(cars => this.listModelo = cars);
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
      paciente: [{value: null, disabled: true}],
      nombreClientePaciente: [{value: null, disabled: true}],
      direccion: [{value: null, disabled: true}],
      codAseguradora: [{value: null, disabled: true}],
      aseguradora: [{value: null, disabled: true}],
      plan: [{value: null, disabled: true}],
      descuentoPlan: [{value: 0, disabled: true}],
      coaseguro: [{value: 0, disabled: true}],
      titular: [{value: null, disabled: true}],
      poliza: [{value: null, disabled: true}],
      planPoliza: [{value: null, disabled: true}],
      codContratante: [{value: null, disabled: true}],
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
      observacionGeneral: [null]
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
      observacionAtencion: item.observacionatencion
    });

    this.isCodPlan = item.codplan;

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
    console.log('item', item);
  }

  private onColumnasGrilla() {
    this.columnas = [
      { field: 'codProd', header: 'Código' },
      { field: 'lote', header: 'Lote' },
      { field: 'descripcion', header: 'Descripción' },
      { field: 'can-m', header: 'Cantidad' },
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
    this.listModelo[index].tipoAutorizacion =  data.value.value;
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
