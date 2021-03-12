import { Component, OnInit } from '@angular/core';
import { GlobalsConstantsForm } from '../../../../constants/globals-constants-form';
import { BreadcrumbService } from '../../../../services/breadcrumb.service';
import { LanguageService } from '../../../../services/language.service';
import { Router } from '@angular/router';
import { DemoService } from '../../../../services/demo.service';
import { VentasService } from '../../services/ventas.service';
import { MenuItem } from 'primeng';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-panel-caja',
  templateUrl: './panel-caja.component.html',
  styleUrls: ['./panel-caja.component.css']
})
export class PanelCajaComponent implements OnInit {
  // Titulo del componente
  titulo = 'Consulta Ventas';
  // Name de los botones de accion
  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm;
  items: MenuItem[];
  listModelo: any[];
  listModeloPago: any[];

  columnas: any;
  columnasPago: any;

  constructor(private breadcrumbService: BreadcrumbService,
              public lenguageService: LanguageService,
              private confirmationService: ConfirmationService,
              public router: Router,
              private demoService: DemoService,
              private readonly ventasService: VentasService) { 
    this.breadcrumbService.setItems([
      { label: 'Módulo Venta' },
      { label: 'Caja', routerLink: ['module-ve/venta-create'] }
    ]);
  }

  ngOnInit(): void {
    this.onOpcionesCabecera();

    this.onColumnasGrilla();

    this.demoService.getCarsLarge().then(cars => this.listModelo = cars);
    this.demoService.getPago().then(cars => this.listModeloPago = cars);
  }

  private onOpcionesCabecera() {
    this.items = [
      {label: "Buscar Venta", icon: this.globalConstants.icoCaja,
        command: () => {
        this.update();
      }},
      {label: "Buscar Comprobante", icon: this.globalConstants.icoPedido,
        command: () => {
        this.update();
      }},
      {separator: true},
      {label: "Prevista", icon: this.globalConstants.icoGanancia,
        command: () => {
        this.update();
      }},
      {label: "PDF Electronica", icon: this.globalConstants.icoGenerico,
        command: () => {
        this.update();
      }},
      {label: "Anular", icon: this.globalConstants.icoSimulacion,
        command: () => {
        this.update();
      }},
      {label: "Dar Baja", icon: this.globalConstants.icoSimulacion,
        command: () => {
        this.update();
      }},
      // {label: "Generar Pago Bot", icon: this.globalConstants.icoSimulacion,
      //   command: () => {
      //   this.update();
      // }},
      // {label: "Obtener Pago Bot", icon: this.globalConstants.icoSimulacion,
      //   command: () => {
      //   this.update();
      // }},
      // {label: "Link Bot", icon: this.globalConstants.icoSimulacion,
      //   command: () => {
      //   this.update();
      // }}
    ];
  }

  private onColumnasGrilla() {
    this.columnas = [
      { field: 'descripcion', header: 'Descripción' },
      { field: 'can-m', header: 'Can-M' },
      { field: 'pvp', header: 'PVP' },
      { field: 'dctoProd', header: 'Dscto.Prd.' },
      { field: 'dctoPlan', header: 'Dscto.Plan' },
      { field: 'totalSigv', header: 'Total S/IGV' },
      { field: 'montoPac', header: 'Monto Pac.' },
      { field: 'montoAseg', header: 'Monto Aseg.' },
      { field: 'codProd', header: 'Cod. Prod.' },
      { field: 'costoVVF', header: 'Costo VVF' },
    ];

    this.columnasPago = [
      { field: 'tipoPago', header: 'Tipo Pago' },
      { field: 'entidad', header: 'Entidad' },
      { field: 'nroOperacion', header: 'Nro Operación' },
      { field: 'soles', header: 'M. Soles' },
      { field: 'dolar', header: 'M. Dolares' },
      { field: 'total', header: 'Total' },
      { field: 'terminal', header: 'Terminal' }
    ];
  }

  onConsultarVenta() {
    this.router.navigate(['/main/modulo-ve/panel-venta'])
  }

  update() {

  }

  onConfirmGrabar() {
    this.confirmationService.confirm({
        message: "¿Seguro de generar documento electrónico?",
        header: "Grabar Documento",
        icon: 'pi pi-info-circle',
        acceptLabel: 'Si',
        rejectLabel: 'No',
        accept: () => {
          // this.isAutenticar = true;
        },
        reject: () => {
          // this.mensajePrimeNgService.onToCancelMsg(this.globalConstants.msgCancelSummary, this.globalConstants.msgCancelDetail);
        }
    });
  }

}
