import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng';
import { GlobalsConstantsForm } from '../../../../constants/globals-constants-form';
import { BreadcrumbService } from '../../../../services/breadcrumb.service';
import { DemoService } from '../../../../services/demo.service';
import { MensajePrimeNgService } from '../../../../services/mensaje-prime-ng.service';

@Component({
  selector: 'app-panel-comprobante',
  templateUrl: './panel-comprobante.component.html',
  styleUrls: ['./panel-comprobante.component.css']
})
export class PanelComprobanteComponent implements OnInit {
  // Titulo del componente
  titulo = 'Comprobante';
  // Name de los botones de accion
  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm();

  listModelo: any[];

  columnas: any;

  // PrimeNG
  items: MenuItem[];

  constructor(private breadcrumbService: BreadcrumbService,
              public mensajePrimeNgService: MensajePrimeNgService,
              private demoService: DemoService) {
    this.breadcrumbService.setItems([
      { label: 'Módulo Venta' },
      { label: 'Consulta', routerLink: ['module-ve/panel-venta'] }
    ]);
  }

  ngOnInit(): void {
  
    this.items = [
      {separator: true},
      {label: 'Detalle', icon: 'fa fa-list', command: () => {
          this.update();
      }},
      {separator: true},
      {label: 'Imp.Venta', icon: 'fa fa-print ', command: () => {
        this.update();
      }},
      {label: 'Imp.Comp', icon: 'fa fa-print ', command: () => {
        this.update();
      }},
      {label: 'PDF Electronico', icon: 'fa fa-print ', command: () => {
        this.update();
      }}
    ];

    this.columnas = [
      { field: 'comprobante', header: 'Comprobante' },
      { field: 'estado', header: 'Estado' },
      { field: 'codVenta', header: 'Cod.Venta' },
      { field: 'codAtencion', header: 'Cod.Atención' },
      { field: 'nombre', header: 'Nombre' },
      { field: 'montoPaciente', header: 'Monto sIGV (S/.).' },
      { field: 'montoPaciente', header: 'Monto sIGV ($).' },
      { field: 'moneda', header: 'Moneda' },
      { field: 'fecEmision', header: 'F.Generado' },
      { field: 'fecCancelación', header: 'F.Cancelación' },
      { field: 'fecAnulación', header: 'F.Anulación' }
    ];

    this.demoService.getComprobante().then(cars => this.listModelo = cars);
  }

  update() {
  }

  save(severity: string) {
  }
}
