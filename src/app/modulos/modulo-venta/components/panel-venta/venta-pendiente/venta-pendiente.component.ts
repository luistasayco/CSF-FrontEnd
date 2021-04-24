import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng';
import { GlobalsConstantsForm } from '../../../../../constants/globals-constants-form';
import { BreadcrumbService } from '../../../../../services/breadcrumb.service';
import { LanguageService } from '../../../../../services/language.service';
import { MensajePrimeNgService } from '../../../../../services/mensaje-prime-ng.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { IResultBusquedaVenta, IVentaCabeceraSingle } from '../../../interface/venta.interface';
import { VentasService } from '../../../services/ventas.service';
import { map } from 'rxjs/operators';

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

  listModelo: IResultBusquedaVenta[];
  modeloItem: IVentaCabeceraSingle;
  columnas: any;

  // Formulario
  formularioBusqueda: FormGroup;
  // Visualizar registro seleccionado
  isVerModalDetalle: boolean;
  isAnular: boolean;
  // PrimeNG
  items: MenuItem[];
  itemSeleccionadoGrilla: IResultBusquedaVenta;
  subscription$: Subscription;
  constructor(private breadcrumbService: BreadcrumbService,
              public lenguageService: LanguageService,
              public mensajePrimeNgService: MensajePrimeNgService,
              private readonly formBuilder: FormBuilder,
              private readonly ventasService: VentasService) {
    this.breadcrumbService.setItems([
      { label: 'Módulo Venta' },
      { label: 'Venta Pendiente', routerLink: ['module-ve/panel-venta'] }
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
      fecha: [new Date],
    });
  }

  private onHeaderGrilla(){
    this.columnas = [
      { field: 'codventa', header: 'Cod.Venta' },
      { field: 'tipomovimiento', header: 'T.Mov' },
      { field: 'nombretipocliente', header: 'T.Cliente' },
      { field: 'codatencion', header: 'Cod.Atención' },
      { field: 'nombreestado', header: 'Estado' },
      { field: 'nombre', header: 'Nombre' },
      { field: 'montopaciente', header: 'Monto Pac.' },
      { field: 'montoaseguradora', header: 'Monto Aseg.' },
      { field: 'fechagenera', header: 'F.Generado' },
      { field: 'fechaemision', header: 'F.Emisión' },
      { field: 'codpedido', header: 'Nro.Pedido' },
      { field: 'codcliente', header: 'Cod.Cliente' },
      { field: 'codpaciente', header: 'Cod.Paciente' }
    ];
  }

  private onOpcionesGrilla() {
    this.items = [
      {label: 'Caja', icon: 'fa fa-credit-card-alt', command: () => {
          this.goCaja();
      }}
    ];
  }

  onItemElegido(data: IResultBusquedaVenta) { 
    this.itemSeleccionadoGrilla = data;
  }

  onDetalle(data: IResultBusquedaVenta) {
    this.goGetVentaPorCodVenta(data.codventa,'DETALLE');
  }

  goListar() {
    let body = this.formularioBusqueda.value;
    this.listModelo = [];
    this.subscription$ = new Subscription();
    this.subscription$ = this.ventasService.getVentaCabeceraPendientePorFiltro(body.fecha)
    .pipe(
      map((resp: IResultBusquedaVenta[]) => {
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

  goCerrarDetalle() {
    this.isVerModalDetalle = !this.isVerModalDetalle;
  }
  
  private goCaja() {

  }
}
