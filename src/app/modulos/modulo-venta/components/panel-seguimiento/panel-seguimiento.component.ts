import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng';
import { GlobalsConstantsForm } from '../../../../constants/globals-constants-form';
import { BreadcrumbService } from '../../../../services/breadcrumb.service';
import { LanguageService } from '../../../../services/language.service';
import { MensajePrimeNgService } from '../../../../services/mensaje-prime-ng.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { IResultBusquedaPedido } from '../../interface/pedido.interface';
import { Subscription } from 'rxjs';
import { VentasService } from '../../services/ventas.service';
import { map } from 'rxjs/operators';
import { IVentaCabeceraSingle } from '../../interface/venta.interface';
import swal from'sweetalert2';

@Component({
  selector: 'app-panel-seguimiento',
  templateUrl: './panel-seguimiento.component.html',
  styleUrls: ['./panel-seguimiento.component.css']
})
export class PanelSeguimientoComponent implements OnInit, OnDestroy {
  // Titulo del componente
  titulo = 'Seguimiento';
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
  itemSeleccionadoGrilla: IResultBusquedaPedido;
  subscription$: Subscription;
  constructor(private breadcrumbService: BreadcrumbService,
              public lenguageService: LanguageService,
              private readonly formBuilder: FormBuilder,
              private readonly ventasService: VentasService) {
    this.breadcrumbService.setItems([
      { label: 'Módulo Venta' },
      { label: 'Seguimiento', routerLink: ['module-ve/panel-venta'] }
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
      fechaini: [new Date()],
      fechafin: [new Date()],
      ccosto: ['11']
    });
  }

  private onHeaderGrilla(){
    this.columnas = [
      { field: 'codventa', header: 'Cod.Venta' },
      { field: 'codatencion', header: 'Cod.Atención' },
      { field: 'cama', header: 'Cama' },
      { field: 'codpedido', header: 'Pedido' },
      { field: 'tipopedido', header: 'T. Pedido' },
      { field: 'fechapedido', header: 'F. Pedido' },
      { field: 'fechagenera', header: 'F. Venta' },
      { field: 'fecha_envio', header: 'F. Envió' },
      { field: 'fecha_entrega', header: 'F. Recepción' }
    ];

  }

  private onOpcionesGrilla() {
    this.items = [
      
      {label: 'Enviar', icon: 'fa fa-list', command: () => {
        this.onEnviar();
      }},
      {label: 'Recepción', icon: 'fa fa-list', command: () => {
        this.onRecepcion();
      }},
      {separator: true},
      {label: 'Cancelar Envió', icon: 'fa fa-list', command: () => {
        this.onCancelarEnvio();
      }},
      {label: 'Cancelar Recepción', icon: 'fa fa-list', command: () => {
        this.onCancelarRecepcion();
      }}
    ];
  }

  onItemElegido(data: IResultBusquedaPedido) { 
    this.itemSeleccionadoGrilla = data;
  }

  onDetalle(data: IResultBusquedaPedido) {
    debugger
    let codventa = data.codventa === undefined ? null : data.codventa.trim();
     codventa = codventa === '' ? null : codventa.trim();

     if (codventa !== null) {
      this.goGetVentaPorCodVenta(data.codventa,'DETALLE');
     } else {
      swal.fire(this.globalConstants.msgErrorSummary, 'Registro no tiene venta realizado','error')
      return;
     }
  }

  goListar() {
    let body = this.formularioBusqueda.value;
    this.listModelo = [];
    this.subscription$ = new Subscription();
    this.subscription$ = this.ventasService.getListaPedidosSeguimientoPorFiltro(body.fechaini, body.fechafin, body.ccosto, 2)
    .pipe(
      map((resp: IResultBusquedaPedido[]) => {
        this.listModelo = resp;
      })
    )
    .subscribe(
      (resp) => {},
      (error) => {
        swal.fire(this.globalConstants.msgErrorSummary, error.error.resultadoDescripcion,'error')
      }
    );
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
    .subscribe(
      (resp) => {},
      (error) => {
        swal.fire(this.globalConstants.msgErrorSummary, error.error.resultadoDescripcion,'error')
      }
    );
  }

  goCerrarDetalle() {
    this.isVerModalDetalle = !this.isVerModalDetalle;
  }

  onEnviar() {
  }

  onRecepcion() {
  }

  onCancelarEnvio() {

  }

  onCancelarRecepcion() {
    
  }

  ngOnDestroy() {
    if (this.subscription$) {
      this.subscription$.unsubscribe();
    }
  }

  
}
