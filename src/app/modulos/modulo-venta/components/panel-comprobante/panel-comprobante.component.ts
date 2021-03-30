import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng';
import { GlobalsConstantsForm } from '../../../../constants/globals-constants-form';
import { BreadcrumbService } from '../../../../services/breadcrumb.service';
import { DemoService } from '../../../../services/demo.service';
import { MensajePrimeNgService } from '../../../../services/mensaje-prime-ng.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { VentasService } from '../../services/ventas.service';
import { IVentaCabeceraSingle } from '../../interface/venta.interface';
import { IResultBusquedaComprobante } from '../../interface/comprobante.interface';

@Component({
  selector: 'app-panel-comprobante',
  templateUrl: './panel-comprobante.component.html',
  styleUrls: ['./panel-comprobante.component.css']
})
export class PanelComprobanteComponent implements OnInit, OnDestroy {
  // Titulo del componente
  titulo = 'Comprobante';
  // Name de los botones de accion
  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm();

  listModelo: any[];

  columnas: any;
  modeloItem: IVentaCabeceraSingle;
  // Visualizar registro seleccionado
  isVerModalDetalle: boolean;
  isAnular: boolean;
  // PrimeNG
  items: MenuItem[];

  // Formulario
  formularioBusqueda: FormGroup;
  itemSeleccionadoGrilla: IResultBusquedaComprobante;
  subscription$: Subscription;
  constructor(private breadcrumbService: BreadcrumbService,
              public mensajePrimeNgService: MensajePrimeNgService,
              private readonly formBuilder: FormBuilder,
              private readonly ventasService: VentasService) {
    this.breadcrumbService.setItems([
      { label: 'Módulo Venta' },
      { label: 'Consulta', routerLink: ['module-ve/panel-venta'] }
    ]);
  }

  ngOnInit(): void {
  
    this.buildForm();
    this.onHeaderGrilla();
    this.onOpcionesGrilla();
    this.goListar();
  }

  private buildForm() {
    this.formularioBusqueda = this.formBuilder.group({
      codcomprobante: ['']
    });
  }

  private onHeaderGrilla(){
    this.columnas = [
      { field: 'codcomprobante', header: 'Comprobante' },
      { field: 'nombreestado', header: 'Estado' },
      { field: 'codventa', header: 'Cod.Venta' },
      { field: 'codatencion', header: 'Cod.Atención' },
      { field: 'anombrede', header: 'Nombre' },
      { field: 'montototal', header: 'Monto sIGV (S/.).' },
      { field: 'montototaldolares', header: 'Monto sIGV ($).' },
      { field: 'moneda', header: 'Moneda' },
      { field: 'fechagenera', header: 'F.Generado' },
      { field: 'fechacancelacion', header: 'F.Cancelación' },
      { field: 'fechaanulacion', header: 'F.Anulación' }
    ];
  }

  private onOpcionesGrilla() {
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
  }

  onItemElegido(data: IResultBusquedaComprobante) { 
    this.itemSeleccionadoGrilla = data;
  }

  onDetalle(data: IResultBusquedaComprobante) {
    this.goGetVentaPorCodVenta(data.codventa,'DETALLE');
  }

  goListar() {
    let body = this.formularioBusqueda.value;
    this.listModelo = [];
    this.subscription$ = new Subscription();
    this.subscription$ = this.ventasService.getListaComprobantesPorFiltro(body.codcomprobante)
    .pipe(
      map((resp: IResultBusquedaComprobante[]) => {
        this.listModelo = resp;
      })
    )
    .subscribe();
  }

  goGetVentaPorCodVenta(codventa: string, opcion: string) {
    this.subscription$ = new Subscription();
    this.subscription$ = this.ventasService.getVentaPorCodVenta(codventa)
    .pipe(
      map((resp: IVentaCabeceraSingle) => {
        this.modeloItem = resp;
        this.isVerModalDetalle = !this.isVerModalDetalle;
        if (opcion === 'DETALLE')
          {
            this.isAnular = false;
          }
      })
    )
    .subscribe();
  }

  ngOnDestroy() {
    if (this.subscription$) {
      this.subscription$.unsubscribe();
    }
  }

  update() {
  }

  save(severity: string) {
  }
}
