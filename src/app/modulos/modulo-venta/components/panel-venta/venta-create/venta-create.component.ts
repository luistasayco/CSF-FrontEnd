import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from '../../../../../services/breadcrumb.service';
import { GlobalsConstantsForm } from '../../../../../constants/globals-constants-form';
import { MenuItem, SelectItem } from 'primeng';
import { LanguageService } from '../../../../../services/language.service';
import { DemoService } from '../../../../../services/demo.service';
import { Router } from '@angular/router';
import { VentasService } from '../../../services/ventas.service';
import { ConfirmationService } from 'primeng/api';
import { IWarehouses } from '../../../../modulo-compartido/Ventas/interfaces/warehouses.interface';
import { FormGroup, FormBuilder } from '@angular/forms';
import { IPaciente } from '../../../../modulo-compartido/Ventas/interfaces/paciente.interface';
import { ICliente } from '../../../../modulo-compartido/Ventas/interfaces/cliente.interface';
import { IPersonalClinica } from '../../../../modulo-compartido/Ventas/interfaces/personal-clinica.interface';
import { IMedico } from '../../../../modulo-compartido/Ventas/interfaces/medico.interface';
import { Subscription } from 'rxjs';
import { IAtencion } from '../../../../modulo-compartido/Ventas/interfaces/atencion.interface';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { SessionService } from '../../../../../services/session.service';
import { VentaDataService } from '../../../services/venta-data.service';
import { ITipoAutorizacion } from '../../../interface/venta.interface';

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

  columnas: any;
  isWarehouseCode: string;
  isAutenticar: boolean = false;
  isVisibleReceta: boolean = false;
  isVisiblePedido: boolean = false;
  isVisibleGenerico: boolean = false;

  // Formulario
  formularioCabecera: FormGroup;
  formularioTotales: FormGroup;

  // Tipo de Cliente
  isTipoCliente: string;

  subscription$: Subscription;

  constructor(private breadcrumbService: BreadcrumbService,
              public lenguageService: LanguageService,
              public router: Router,
              private demoService: DemoService,
              private readonly ventasService: VentasService,
              private readonly ventaDataService: VentaDataService,
              private confirmationService: ConfirmationService,
              private sessionService: SessionService,
              private readonly fb: FormBuilder) {     
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

    this.onOpcionesCabecera();

    this.onColumnasGrilla();
    this.goGetTipoAutorizacion();

    this.demoService.getCarsLarge().then(cars => this.listModelo = cars);
  }

  private onOpcionesCabecera() {
    this.items = [
      {label: this.globalConstants.cConsultar, icon: this.globalConstants.icoConsultar,
        command: () => {
        this.onConsultarVenta();
      }},
      {label: this.globalConstants.cCaja, icon: this.globalConstants.icoCaja,
        command: () => {
        this.update();
      }},
      {label: "Receta", icon: this.globalConstants.icoPedido,
        command: () => {
        this.goReceta();
      }},
      {label: this.globalConstants.cPedido, icon: this.globalConstants.icoPedido,
        command: () => {
        this.goPedido();
      }},
      {separator: true},
      {label: this.globalConstants.cGanancia, icon: this.globalConstants.icoGanancia,
        command: () => {
        this.update();
      }},
      {label: this.globalConstants.cGenerico, icon: this.globalConstants.icoGenerico,
        command: () => {
        this.goGetProductosGenericos();
      }},
      {label: this.globalConstants.cSimulacion, icon: this.globalConstants.icoSimulacion,
        command: () => {
        this.update();
      }},
    ];
  }

  private buildForm() {
    this.formularioCabecera = this.fb.group({
      codAlmacen: [null],
      desAlmacen: [null],
      fecha: [{value: new Date(), disabled: true}],
      tipoCambio: [{value: 3.3233, disabled: true}],
      sinStock:[false],
      estado: [null],
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
      descuentoPlan: [{value: null, disabled: true}],
      coaseguro: [{value: null, disabled: true}],
      titular: [{value: null, disabled: true}],
      poliza: [{value: null, disabled: true}],
      planPoliza: [{value: null, disabled: true}],
      codContratante: [{value: null, disabled: true}],
      contratante: [{value: null, disabled: true}],
      cama: [{value: null, disabled: true}],
      telefono: [{value: null, disabled: true}],
      codEmpresa: [{value: null, disabled: true}],
      empresa: [{value: null, disabled: true}],
      deducible: [{value: null, disabled: true}],
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

    if (this.isTipoCliente === '01') {
      this.formularioCabecera.controls.direccion.disable();
    }
    if (this.isTipoCliente !== '01') {
      this.formularioCabecera.controls.direccion.enable();
    }
  }

  goAlmacenSeleccionado(item: IWarehouses) {
    this.formularioCabecera.patchValue({
      codAlmacen: item.warehouseCode,
      desAlmacen: item.warehouseName
    });
  }

  goAtencionSeleccionado(item: IPaciente) {
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
      cama: item.cama,
      telefono: item.telefono,
      planPoliza: item.planpoliza,
      deducible: item.deducible,
      observacionPaciente: item.observacionespaciente,
      observacionAtencion: item.observacionatencion
    });

    this.getListMedicoPorAtencion (item.codatencion);
  }

  private getListMedicoPorAtencion(codAtencion: string) {
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
      codClienteExterno: item.cardCode
    });
  }

  goPersonalClinicaSeleccionado(item: IPersonalClinica) {
    this.formularioCabecera.patchValue({
      codPersonal: item.codpersonal
    });
  }

  goMedicoSeleccionado(item: IMedico) {
    this.formularioCabecera.patchValue({
      codMedico: item.codmedico
    });
  }

  private onListarTipoVenta() {
    // this.ventasService.getTipoVenta().then(tipoVenta => this.);
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

  update() {

  }

  goReceta() {
    this.isVisibleReceta =!this.isVisibleReceta;
  }
  goPedido() {
    // this.router.navigate(['/main/modulo-ve/panel-pedido'])
    this.isVisiblePedido = !this.isVisiblePedido;
  }

  ouSelectAlamcen(event: any) {
    console.log('ouSelectAlamcen', event);
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
