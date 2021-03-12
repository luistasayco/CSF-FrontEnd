import { Component, EventEmitter, OnInit, Output, OnDestroy } from '@angular/core';
import { GlobalsConstantsForm } from '../../../../../constants/globals-constants-form';
import { IWarehouses } from '../../interfaces/warehouses.interface';
import { FormGroup, FormBuilder } from '@angular/forms';
import { VentaCompartidoService } from '../../services/venta-compartido.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-modal-busqueda-almacen',
  templateUrl: './modal-busqueda-almacen.component.html',
  styleUrls: ['./modal-busqueda-almacen.component.css']
})
export class ModalBusquedaAlmacenComponent implements OnInit, OnDestroy {
  // Variables globales
  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm();
  //Lista
  listModelo: IWarehouses[];
  seleccionItem: IWarehouses;

  // Variable de visualizar tabla
  isVisualizar: boolean = false;

  //Columnas de la tabla
  columnas: any;
  formularioBusqueda: FormGroup;
  formularioVisor: FormGroup;
  subscription$: Subscription;
  loading: boolean;

  @Output() eventoResgistroSeleccionado = new EventEmitter<IWarehouses>();
  @Output() eventoCancelar = new EventEmitter<IWarehouses>();

  constructor(private readonly fb: FormBuilder,
              private readonly ventaCompartidoService: VentaCompartidoService) { }

  ngOnInit(): void {
    this.buildForm();
    this.buildFormVisor();
    this.buildColumnas();
  }

  private buildForm() {
    this.formularioBusqueda = this.fb.group({
      nombre: [null],
    });
  }

  private buildFormVisor() {
    this.formularioVisor = this.fb.group({
      nombreVisor: [null],
    });
  }

  private buildColumnas() {
    this.columnas = [
      { field: 'warehouseCode', header: 'Código' },
      { field: 'warehouseName', header: 'Nombre' }
    ];
  }

  getListWarehousesContains() {
    const formBody = this.formularioBusqueda.value;
    this.loading = true;
    this.subscription$ = new Subscription();
    this.subscription$ = this.ventaCompartidoService.getListWarehousesContains(formBody.nombre.toUpperCase())
    .subscribe((data: IWarehouses[]) => {
      this.listModelo = [];
      this.listModelo = data;
      this.loading = false;
    },
    (error) => {
      this.loading = false;
    });
  }

  clickAceptar() {
    this.LimpiarFiltroBusqueda();
    this.formularioVisor.patchValue({
      nombreVisor: this.seleccionItem.warehouseName
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
      nombre: ''
    });
  }

  ngOnDestroy() {
    if (this.subscription$) {
      this.subscription$.unsubscribe();
    }
  }
}
