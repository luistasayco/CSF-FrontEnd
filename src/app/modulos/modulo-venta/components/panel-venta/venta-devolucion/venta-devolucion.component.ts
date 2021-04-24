import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng';
import { GlobalsConstantsForm } from '../../../../../constants/globals-constants-form';
import { BreadcrumbService } from '../../../../../services/breadcrumb.service';
import { LanguageService } from '../../../../../services/language.service';
import { Router } from '@angular/router';
import { DemoService } from '../../../../../services/demo.service';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-venta-devolucion',
  templateUrl: './venta-devolucion.component.html',
  styleUrls: ['./venta-devolucion.component.css']
})
export class VentaDevolucionComponent implements OnInit {
  // Titulo del componente
  titulo = 'Consulta Ventas';
  // Name de los botones de accion
  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm;

  items: MenuItem[];

  listModelo: any[];

  columnas: any;

  isVisible: boolean = false;
  isVisiblePedido: boolean = false;
  isVisibleNotaCredito: boolean = false;

  constructor(private breadcrumbService: BreadcrumbService,
              public lenguageService: LanguageService,
              public router: Router,
              private demoService: DemoService,
              private confirmationService: ConfirmationService) {     
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
      { field: 'codProd', header: 'Código' },
      { field: 'lote', header: 'Lote' },
      { field: 'descripcion', header: 'Descripción' },
      { field: 'can-m', header: 'Cantidad' },
      { field: 'can-m', header: 'Max. Dev.' },
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
      { field: 'noCubierto', header: 'No Cubierto' }
      // { field: 'nroPedido', header: 'NroPedido' },
      // { field: 'tipoAutorizacion', header: 'Tipo Autorización' },
      // { field: 'nroAutorizacion', header: 'Nro Autorización' },
      // { field: 'tipoProducto', header: 'Tipo Prod.' }
    ];

    // this.demoService.getCarsLarge().then(cars => this.listModelo = cars);
  }

  update() {

  }

  goPedido() {
    this.router.navigate(['/main/modulo-ve/panel-pedido'])
  }

  // onConfirmGrabar() {
  //   this.confirmationService.confirm({
  //       message: "¿Seguro de realizar la devolución, del vale de venta seleccionado?",
  //       header: "Confirmar Devolución",
  //       icon: 'pi pi-info-circle',
  //       acceptLabel: 'Si',
  //       rejectLabel: 'No',
  //       accept: () => {
          
  //       },
  //       reject: () => {
  //         // this.mensajePrimeNgService.onToCancelMsg(this.globalConstants.msgCancelSummary, this.globalConstants.msgCancelDetail);
  //       }
  //   });
  // }

  onConfirmGrabar() {
    this.confirmationService.confirm({
        message: "¿Desea generar la Nota Electrónica: C29382929292?",
        header: "Confirmar Generación",
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

  goVisiblePedido () {
    this.isVisiblePedido = !this.isVisiblePedido;
  }

  goVisibleNotaCredito () {
    this.isVisibleNotaCredito = !this.isVisibleNotaCredito;
  }
}
