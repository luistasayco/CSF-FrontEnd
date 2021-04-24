import { Component, OnInit, OnDestroy } from '@angular/core';
import { GlobalsConstantsForm } from '../../../../constants/globals-constants-form';
import { MenuItem } from 'primeng';
import { BreadcrumbService } from '../../../../services/breadcrumb.service';
import { VentasService } from '../../services/ventas.service';
import { IResultBusquedaVenta, IVentaCabeceraSingle } from '../../interface/venta.interface';
import { map } from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { LanguageService } from '../../../../services/language.service';

@Component({
  selector: 'app-panel-venta',
  templateUrl: './panel-venta.component.html',
  styleUrls: ['./panel-venta.component.css']
})
export class PanelVentaComponent implements OnInit, OnDestroy {
  // Titulo del componente
  titulo = 'Venta Consulta';
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

  // Toast
  intervaloToast;

  constructor(private readonly breadcrumbService: BreadcrumbService,
              public readonly messageService: MessageService,
              private readonly formBuilder: FormBuilder,
              private readonly confirmationService: ConfirmationService,
              private readonly ventasService: VentasService,
              public lenguageService: LanguageService) {
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
      codventa: [''],
      fechaIni: [new Date],
      fechaFin: [new Date]
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
      { field: 'fechaemision', header: 'F.Emisión' },
      { field: 'codpedido', header: 'Nro.Pedido' },
      { field: 'codcliente', header: 'Cod.Cliente' },
      { field: 'codpaciente', header: 'Cod.Paciente' }
    ];
  }

  onItemElegido(data: IResultBusquedaVenta) { 
    this.itemSeleccionadoGrilla = data;
  }

  private onOpcionesGrilla() {
    this.items = [
      {label: this.globalConstants.cAnular, icon: this.globalConstants.icoCancelar, command: () => {
        this.onAnular();
      }},
      {separator: true},
      {label: this.globalConstants.cCaja, icon: this.globalConstants.icoCaja, command: () => {
        this.onCaja();
      }},
      {separator: true},
      {label: this.globalConstants.cImprimir, icon: this.globalConstants.icoImprimir, command: () => {
        this.onImpVenta();
      }},
      {label: this.globalConstants.cImprimirComprobante, icon: this.globalConstants.icoImprimir, command: () => {
        this.onImpComp();
      }},
      {label: this.globalConstants.cImprimirVencimiento, icon: this.globalConstants.icoImprimir, command: () => {
        this.onImpVenc();
      }},
      {label: this.globalConstants.cPdfElectronico, icon: this.globalConstants.icoImprimir, command: () => {
        this.onImpVenc();
      }}
    ];
  }

  goListar() {
    let body = this.formularioBusqueda.value;
    this.listModelo = [];
    this.subscription$ = new Subscription();
    this.subscription$ = this.ventasService.getVentasPorFiltro(body.codcomprobante, body.codventa, body.fechaIni, body.fechaFin)
    .pipe(
      map((resp: IResultBusquedaVenta[]) => {
        this.listModelo = resp;
      })
    )
    .subscribe(
      (resp) => {},
      (error) => {
        this.messageService.add({severity:'error', summary: this.globalConstants.msgErrorSummary, detail: error.error});
    });
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

  goCerrarDetalle() {
    this.isVerModalDetalle = !this.isVerModalDetalle;
  }

  private onAnular() {

    if (this.itemSeleccionadoGrilla.estado === 'C' && this.itemSeleccionadoGrilla.codcomprobante.trim() !== '') {
      this.messageService.add({severity:'info', summary: this.globalConstants.msgInfoSummary, detail:`No puede anular la venta ${this.itemSeleccionadoGrilla.codventa}, tiene comprobante`});
      return;
    }

    if (this.itemSeleccionadoGrilla.tipomovimiento !== 'DV') {
      this.messageService.add({severity:'info', summary: this.globalConstants.msgInfoSummary, detail:`No puede anular la venta  ${this.itemSeleccionadoGrilla.codventa}, no es una venta`});
      return;
    }

    if (this.itemSeleccionadoGrilla.usuarioanulacion.trim() !== '') {
      this.messageService.add({severity:'info', summary: this.globalConstants.msgInfoSummary, detail:`La venta ${this.itemSeleccionadoGrilla.codventa} se encuentra ANULADA`});
      return;
    }

    this.goGetVentaPorCodVenta(this.itemSeleccionadoGrilla.codventa,'ANULAR');
  }

  onCaja() {
    // this.mensajePrimeNgService.onToExitoMsg(null, 'onCaja');
  }

  onImpVenta() {
    // this.mensajePrimeNgService.onToExitoMsg(null, 'onImpVenta');
  }

  onImpComp() {
    // this.mensajePrimeNgService.onToExitoMsg(null, 'onImpComp');
  }

  onImpVenc() {
    // this.mensajePrimeNgService.onToExitoMsg(null, 'onImpVenc');
  }

  ngOnDestroy() {
    if (this.subscription$) {
      this.subscription$.unsubscribe();
    }

    this.messageService.clear();
  }
}
