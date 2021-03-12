import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng';
import { GlobalsConstantsForm } from '../../../../../constants/globals-constants-form';
import { BreadcrumbService } from '../../../../../services/breadcrumb.service';
import { DemoService } from '../../../../../services/demo.service';
import { LanguageService } from '../../../../../services/language.service';
import { MensajePrimeNgService } from '../../../../../services/mensaje-prime-ng.service';

@Component({
  selector: 'app-venta-pendiente',
  templateUrl: './venta-pendiente.component.html',
  styleUrls: ['./venta-pendiente.component.css']
})
export class VentaPendienteComponent implements OnInit {
  // Titulo del componente
  titulo = 'Venta Pendiente';
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
      {label: 'Caja', icon: 'fa fa-credit-card-alt', command: () => {
          this.update();
      }}
    ];

    this.columnas = [
      { field: 'codVenta', header: 'Cod.Venta' },
      { field: 'tipoMov', header: 'T.Mov' },
      { field: 'tipoPaciente', header: 'T.Cliente' },
      // { field: 'codAtencion', header: 'Cod.Atención' },
      // { field: 'comprobante', header: 'Comprobante' },
      // { field: 'estado', header: 'Estado' },
      { field: 'nombre', header: 'Nombre' },
      { field: 'montoPaciente', header: 'Monto Pac.' },
      { field: 'montoAsegurado', header: 'Monto Aseg.' },
      // { field: 'gratuito', header: 'Gratuito' },
      { field: 'fecGenerado', header: 'F.Generado' },
      { field: 'fecEmision', header: 'F.Emisión' }
    ];

    this.demoService.getCarsSmall().then(cars => this.listModelo = cars);
  }

  update() {
  }

  save(severity: string) {
  }
}
