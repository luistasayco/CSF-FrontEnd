import { Component, OnInit, OnDestroy } from '@angular/core';
import { GlobalsConstantsForm } from '../../../../constants/globals-constants-form';
import { MenuItem } from 'primeng';
import { BreadcrumbService } from '../../../../services/breadcrumb.service';
import { MensajePrimeNgService } from '../../../../services/mensaje-prime-ng.service';
import { VentasService } from '../../services/ventas.service';
import { IResultBusquedaVenta, IVentaCabeceraSingle } from '../../interface/venta.interface';
import { map } from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-panel-venta',
  templateUrl: './panel-venta.component.html',
  styleUrls: ['./panel-venta.component.css']
})
export class PanelVentaComponent implements OnInit, OnDestroy {
  // Titulo del componente
  titulo = 'Consulta Ventas';
  tituloDetalle = "Venta"
  // Name de los botones de accion
  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm();

  listModelo: IResultBusquedaVenta[];
  modeloItem: IVentaCabeceraSingle;

  columnas: any;

  // PrimeNG
  items: MenuItem[];
  itemSeleccionadoGrilla: IResultBusquedaVenta;

  // Formulario
  formularioBusqueda: FormGroup;

  // Visualizar registro seleccionado
  isVerModalDetalle: boolean;
  isAnular: boolean;

  subscription$: Subscription;

  constructor(private readonly breadcrumbService: BreadcrumbService,
              public readonly mensajePrimeNgService: MensajePrimeNgService,
              private readonly formBuilder: FormBuilder,
              private readonly confirmationService: ConfirmationService,
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
      codcomprobante: [''],
      codventa: ['']
    });
  }

  private onHeaderGrilla() {
    this.columnas = [
      { field: 'codventa', header: 'Cod.Venta' },
      { field: 'tipomovimiento', header: 'T.Mov' },
      { field: 'nombretipocliente', header: 'T.Cliente' },
      { field: 'codatencion', header: 'Cod.Atención' },
      { field: 'codcomprobante', header: 'Comprobante' },
      { field: 'estado', header: 'Estado' },
      { field: 'nombre', header: 'Nombre' },
      { field: 'montopaciente', header: 'Monto Pac.' },
      { field: 'montoaseguradora', header: 'Monto Aseg.' },
      { field: 'flg_gratuito', header: 'Gratuito' },
      { field: 'fechagenera', header: 'F.Generado' },
      { field: 'fechaemision', header: 'F.Emisión' }
    ];
  }

  onItemElegido(data: IResultBusquedaVenta) { 
    this.itemSeleccionadoGrilla = data;
  }

  private onOpcionesGrilla() {
    this.items = [
      {label: 'Anular', icon: 'fa fa-times', command: () => {
          this.setAnular();
      }},
      {separator: true},
      {label: 'Caja', icon: 'fa fa-credit-card-alt', command: () => {
          this.onCaja();
      }},
      {separator: true},
      {label: 'Imp.Venta', icon: 'fa fa-print ', command: () => {
        this.onImpVenta();
      }},
      {label: 'Imp.Comp', icon: 'fa fa-print ', command: () => {
        this.onImpComp();
      }},
      {label: 'Imp.Venc.', icon: 'fa fa-print ', command: () => {
        this.onImpVenc();
      }}
    ];
  }

  goListar() {
    let body = this.formularioBusqueda.value;
    this.listModelo = [];
    this.subscription$ = new Subscription();
    this.subscription$ = this.ventasService.getVentasPorFiltro(body.codcomprobante, body.codventa)
    .pipe(
      map((resp: IResultBusquedaVenta[]) => {
        this.listModelo = resp;
        console.log('this.listModelo', this.listModelo );
      })
    )
    .subscribe();
  }

  onDetalle(data: IResultBusquedaVenta) {
    this.goGetVentaPorCodVenta(data.codventa,'DETALLE');
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
        if (opcion === 'ANULAR')
        {
          this.isAnular = true;
        }
      })
    )
    .subscribe();
  }

  private setAnular() {
    this.goGetVentaPorCodVenta(this.itemSeleccionadoGrilla.codventa,'ANULAR');
  }

  onCaja() {
    this.mensajePrimeNgService.onToExitoMsg(null, 'onCaja');
  }

  onImpVenta() {
    this.mensajePrimeNgService.onToExitoMsg(null, 'onImpVenta');
  }

  onImpComp() {
    this.mensajePrimeNgService.onToExitoMsg(null, 'onImpComp');
  }

  onImpVenc() {
    this.mensajePrimeNgService.onToExitoMsg(null, 'onImpVenc');
  }

  ngOnDestroy() {
    if (this.subscription$) {
      this.subscription$.unsubscribe();
    }
  }
}
