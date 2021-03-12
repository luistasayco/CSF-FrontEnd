import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng';
import { GlobalsConstantsForm } from '../../../../constants/globals-constants-form';
import { BreadcrumbService } from '../../../../services/breadcrumb.service';
import { DemoService } from '../../../../services/demo.service';
import { LanguageService } from '../../../../services/language.service';
import { MensajePrimeNgService } from '../../../../services/mensaje-prime-ng.service';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-panel-planilla',
  templateUrl: './panel-planilla.component.html',
  styleUrls: ['./panel-planilla.component.css']
})
export class PanelPlanillaComponent implements OnInit {
  // Titulo del componente
  titulo = 'Planilla';
  // Name de los botones de accion
  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm();

  listModelo: any[];

  columnas: any;

  // PrimeNG
  items: MenuItem[];

  itemsImprimir: MenuItem[];

  constructor(private breadcrumbService: BreadcrumbService,
              public lenguageService: LanguageService,
              public mensajePrimeNgService: MensajePrimeNgService,
              private confirmationService: ConfirmationService,
              private demoService: DemoService) {
    this.breadcrumbService.setItems([
      { label: 'Módulo Venta' },
      { label: 'Consulta', routerLink: ['module-ve/panel-venta'] }
    ]);
  }

  ngOnInit(): void {
  
    this.items = [
      {label: 'Ver Tipo Pago', icon: 'fa fa-list', command: () => {
          this.update();
      }}
    ];

    this.itemsImprimir = [
      {label: 'Imprimir Detalle', icon: 'fa fa-list', command: () => {
        this.update();
      }},
      {label: 'Consultar Planilla', icon: 'fa fa-list', command: () => {
        this.update();
      }}
    ];

    this.columnas = [
      { field: 'documento', header: 'Comprobante' },
      { field: 'nombre', header: 'Nombre' },
      { field: 'monto', header: 'Monto S/.' },
      { field: 'movimiento', header: 'Movimiento' }
    ];

    this.demoService.getPlanilla().then(cars => this.listModelo = cars);
  }

  update() {
  }

  save(severity: string) {
  }

  onConfirmGrabar() {
    this.confirmationService.confirm({
        message: "¿Seguro de generar Planilla",
        header: "Confirmar Planillas",
        icon: 'pi pi-info-circle',
        acceptLabel: 'Si',
        rejectLabel: 'No',
        accept: () => {
          
        },
        reject: () => {
          // this.mensajePrimeNgService.onToCancelMsg(this.globalConstants.msgCancelSummary, this.globalConstants.msgCancelDetail);
        }
    });
  }

}
