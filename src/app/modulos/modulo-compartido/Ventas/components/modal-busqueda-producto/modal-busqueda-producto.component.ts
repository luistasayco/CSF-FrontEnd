import { Component, EventEmitter, OnInit, Output, OnDestroy } from '@angular/core';
import { GlobalsConstantsForm } from '../../../../../constants/globals-constants-form';
import { DemoService } from '../../../../../services/demo.service';
import { VentaCompartidoService } from '../../services/venta-compartido.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { IProducto } from '../../interfaces/producto.interface';

@Component({
  selector: 'app-modal-busqueda-producto',
  templateUrl: './modal-busqueda-producto.component.html',
  styleUrls: ['./modal-busqueda-producto.component.css']
})
export class ModalBusquedaProductoComponent implements OnInit, OnDestroy {
  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm();
  listModelo: IProducto[];
  seleccionItem: IProducto;

  listModeloLote: IProducto[];

  isVisualizar: boolean = false;
  columnas: any;
  columnasLote: any;

  formularioBusqueda: FormGroup;
  formularioVisor: FormGroup;
  subscription$: Subscription;
  loading: boolean;
  loadingGenerico: boolean;

  @Output() eventoResgistroSeleccionado = new EventEmitter<IProducto>();
  @Output() eventoCancelar = new EventEmitter<IProducto>();

  constructor(private ventaCompartidoService: VentaCompartidoService,
              private readonly fb: FormBuilder) { }

  ngOnInit(): void {
    this.seleccionItem = null;
    this.listModeloLote = [];
    this.buildForm();
    this.buildFormVisor();
    this.buildColumnas();
  }

  private buildForm() {
    this.formularioBusqueda = this.fb.group({
      codigo: [''],
      nombre: ['']
    });
  }

  private buildFormVisor() {
    this.formularioVisor = this.fb.group({
      nombreVisor: [null],
    });
  }

  private buildColumnas() {
    this.columnas = [
      { field: 'itemCode', header: 'Código' },
      { field: 'lote', header: 'Lote' },
      { field: 'itemName', header: 'Nombre' },
      { field: 'u_SYP_CS_LABORATORIO', header: 'Laboratorio' },
      { field: 'avgStdPrice', header: 'Precio' },
      { field: 'quantityOnStock', header: 'Stock' }
    ];

    this.columnasLote = [
      { field: 'itemCode', header: 'Código' },
      { field: 'lote', header: 'Lote' },
      { field: 'itemName', header: 'Nombre' },
      { field: 'u_SYP_CS_LABORATORIO', header: 'Laboratorio' },
      { field: 'avgStdPrice', header: 'Precio' },
      { field: 'quantityOnStock', header: 'Stock' }
    ];
  }

  getListProductoPorFiltro() {
    const formBody = this.formularioBusqueda.value;
    this.loading = true;
    this.subscription$ = new Subscription();
    this.subscription$ = this.ventaCompartidoService.getListProductoPorFiltro(formBody.codigo.toUpperCase(), formBody.nombre.toUpperCase())
    .subscribe((data: IProducto[]) => {
      this.listModelo = [];
      this.listModelo = data;
      this.listModeloLote = [];
      this.loading = false;
    },
    (error) => {
      this.loading = false;
    });
  }

  getListProductoGenericoPorCodigo() {
    if (this.seleccionItem === null) {
      return;
    }

    if (this.seleccionItem.u_SYP_CS_FAMILIA === null) {
      return;
    }

    this.loadingGenerico = true;
    this.subscription$ = new Subscription();
    this.subscription$ = this.ventaCompartidoService.getListProductoGenericoPorCodigo(this.seleccionItem.u_SYP_CS_FAMILIA)
    .subscribe((data: IProducto[]) => {
      this.listModeloLote = [];
      this.listModeloLote = data;
      this.loadingGenerico = false;
    },
    (error) => {
      this.loadingGenerico = false;
    });
  }

  goClearGenerico() {
    this.listModeloLote = [];
  }

  clickAceptar() {
    this.LimpiarFiltroBusqueda();
    this.formularioVisor.patchValue({
      nombreVisor: this.seleccionItem.itemCode
    });
    this.isVisualizar = false;
    this.eventoResgistroSeleccionado.emit(this.seleccionItem);
  }

  clickCancelar() {
    this.LimpiarFiltroBusqueda();
    this.isVisualizar = false;
    this.eventoCancelar.emit();
  }

  private LimpiarFiltroBusqueda() {
    this.formularioBusqueda.patchValue({
      codigo: '',
      nombre: ''
    });
  }

  ngOnDestroy() {
    if (this.subscription$) {
      this.subscription$.unsubscribe();
    }
  }

}
