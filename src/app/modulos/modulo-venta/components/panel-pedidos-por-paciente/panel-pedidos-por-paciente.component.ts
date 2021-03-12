import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng';
import { GlobalsConstantsForm } from '../../../../constants/globals-constants-form';
import { BreadcrumbService } from '../../../../services/breadcrumb.service';
import { DemoService } from '../../../../services/demo.service';
import { MensajePrimeNgService } from '../../../../services/mensaje-prime-ng.service';

@Component({
  selector: 'app-panel-pedidos-por-paciente',
  templateUrl: './panel-pedidos-por-paciente.component.html',
  styleUrls: ['./panel-pedidos-por-paciente.component.css']
})
export class PanelPedidosPorPacienteComponent implements OnInit {
  // Titulo del componente
  titulo = 'Paciente de Clínica';
  // Name de los botones de accion
  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm();

  listModelo: any[];

  columnas: any;
  isVisible: boolean = false;
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
      // {label: 'P. Material', icon: 'fa fa-list', command: () => {
      //     this.update();
      // }}
    ];

    this.columnas = [
      { field: 'cama', header: 'Cama' },
      { field: 'atencion', header: 'Atención' },
      { field: 'fechaIngresa', header: 'Fecha Ing.' },
      { field: 'apellidosNombres', header: 'Apellidos y Nombres' },
      { field: 'edad', header: 'Edad' },
      { field: 'sexo', header: 'Sexo' },
      { field: 'medico', header: 'Medico' },
      { field: 'poliza', header: 'Poliza' },
      { field: 'historia', header: 'His. Cli.' },
      { field: 'aseguradora', header: 'Nombre aseguradora' }
    ];

    this.demoService.getCarsMedium().then(cars => this.listModelo = cars);
  }

  update() {
  }

  save(severity: string) {
    this.isVisible = !this.isVisible;
  }

}
