import { Component, Input, OnInit } from '@angular/core';
import { GlobalsConstantsForm } from '../../../../../constants/globals-constants-form';
import { MenuItem } from 'primeng';
import { BreadcrumbService } from '../../../../../services/breadcrumb.service';
import { LanguageService } from '../../../../../services/language.service';
import { Router } from '@angular/router';
import { DemoService } from '../../../../../services/demo.service';
import { VentasService } from '../../../services/ventas.service';

@Component({
  selector: 'app-venta-ver',
  templateUrl: './venta-ver.component.html',
  styleUrls: ['./venta-ver.component.css']
})
export class VentaVerComponent implements OnInit {
  // Titulo del componente
  titulo = 'Consulta Ventas';
  
  @Input() isVisibleAnular: boolean 
  // Name de los botones de accion
  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm;

  items: MenuItem[];

  listModelo: any[];

  columnas: any;

  isVerModalDetalle: boolean
  constructor(private breadcrumbService: BreadcrumbService,
              public lenguageService: LanguageService,
              public router: Router,
              private demoService: DemoService) {     
    this.breadcrumbService.setItems([
      { label: 'Módulo Venta' },
      { label: 'Venta', routerLink: ['module-ve/venta-create'] }
    ]);
  }

  ngOnInit(): void {
    this.items = [
      {label: this.globalConstants.cGrabar, icon: this.globalConstants.icoGrabar, 
       command: () => { 
        this.update();
      }},
      {label: this.globalConstants.cImprimir, icon: this.globalConstants.icoImprimir, 
        command: () => {
          this.update();
      }},
      {label: this.globalConstants.cConsultar, icon: this.globalConstants.icoConsultar,
        command: () => {
        this.update();
      }},
      {label: this.globalConstants.cCaja, icon: this.globalConstants.icoCaja,
        command: () => {
        this.update();
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
        this.update();
      }},
      {label: this.globalConstants.cSimulacion, icon: this.globalConstants.icoSimulacion,
        command: () => {
        this.update();
      }},
    ];

    this.columnas = [
      { field: 'descripcion', header: 'Descripción' },
      // { field: 'can-e', header: 'Can-E' },
      { field: 'can-m', header: 'Cantidad' },
      // { field: 'dev-m', header: 'Dev-M' },
      { field: 'pvp', header: 'PVP' },
      { field: 'dctoProd', header: 'Dscto.Prd.' },
      { field: 'dctoPlan', header: 'Dscto.Plan' },
      { field: 'totalSigv', header: 'Total' },
      { field: 'montoPac', header: 'Monto Pac.' },
      { field: 'montoAseg', header: 'Monto Aseg.' },
      { field: 'codProd', header: 'Cod. Prod.' },
      // { field: 'stockF', header: 'Stock F.' },
      // { field: 'moneda', header: 'Moneda' },
     
      
      { field: 'vvp', header: 'VVP' },
       { field: 'costoVVF', header: 'Costo VVF' },
      // { field: 'totalCigv', header: 'Total C/IGV' },
      { field: 'precioUnid', header: 'Precio Uni.' },
      // { field: 'igvProd', header: 'IGV Prod' },
      // { field: 'noCubierto', header: 'NoCubierto' },
      // { field: 'nroPedido', header: 'NroPedido' },
      // { field: 'qtyAlmE', header: 'Qty Alm-E' },
      // { field: 'qtyAlmM', header: 'Qty Alm-M' },

      // { field: 'tipoAutorizacion', header: 'Tipo Autorización' },
      // { field: 'nroAutorizacion', header: 'Nro Autorización' },
      // { field: 'tipoProducto', header: 'Tipo Prod.' },
      // { field: 'pedCanE', header: 'Ped Can. E' },
      // { field: 'pedCanM', header: 'Ped Can. M' }
    ];

    this.demoService.getCarsLarge().then(cars => this.listModelo = cars);
  }

  update() {

  }

  goPedido() {
    this.router.navigate(['/main/modulo-ve/panel-pedido'])
  }
  
  getAnular() {
    this.isVerModalDetalle = !this.isVerModalDetalle;
  }
}
