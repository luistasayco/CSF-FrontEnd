import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng';
import { GlobalsConstantsForm } from '../../../../constants/globals-constants-form';
import { BreadcrumbService } from '../../../../services/breadcrumb.service';
import { DemoService } from '../../../../services/demo.service';
import { LanguageService } from '../../../../services/language.service';
import { MensajePrimeNgService } from '../../../../services/mensaje-prime-ng.service';

@Component({
  selector: 'app-panel-seguimiento',
  templateUrl: './panel-seguimiento.component.html',
  styleUrls: ['./panel-seguimiento.component.css']
})
export class PanelSeguimientoComponent implements OnInit {
  // Titulo del componente
  titulo = 'Seguimiento';
  // Name de los botones de accion
  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm();

  listModelo: any[];

  columnas: any;

  // PrimeNG
  items: MenuItem[];

  constructor(private breadcrumbService: BreadcrumbService,
              public lenguageService: LanguageService,
              public mensajePrimeNgService: MensajePrimeNgService,
              private demoService: DemoService) {
    this.breadcrumbService.setItems([
      { label: 'Módulo Venta' },
      { label: 'Consulta', routerLink: ['module-ve/panel-venta'] }
    ]);
  }

  ngOnInit(): void {
  
    this.items = [
      
      {label: 'Enviar', icon: 'fa fa-list', command: () => {
          this.update();
      }},
      {label: 'Recepción', icon: 'fa fa-list', command: () => {
        this.update();
      }},
      {separator: true},
      {label: 'Cancelar Envió', icon: 'fa fa-list', command: () => {
        this.update();
      }},
      {label: 'Cancelar Recepción', icon: 'fa fa-list', command: () => {
        this.update();
      }}
    ];

    this.columnas = [
      { field: 'codVenta', header: 'Cod.Venta' },
      { field: 'codAtencion', header: 'Cod.Atención' },
      { field: 'cama', header: 'Cama' },
      { field: 'codPedido', header: 'Pedido' },
      { field: 'tipoPedido', header: 'T. Pedido' },
      { field: 'fechaPedido', header: 'F. Pedido' },
      { field: 'fecGenerado', header: 'F. Venta' },
      { field: 'fechaEnvio', header: 'F. Envió' },
      { field: 'fechaRecepcion', header: 'F. Recepción' }
    ];

    this.demoService.getCarsSmall().then(cars => this.listModelo = cars);
  }

  update() {
  }

  save(severity: string) {
  }
}
