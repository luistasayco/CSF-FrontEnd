import { Component, EventEmitter, OnInit, Output, OnDestroy, Input } from '@angular/core';
import { GlobalsConstantsForm } from '../../../../../constants/globals-constants-form';
import { VentaCompartidoService } from '../../services/venta-compartido.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { IProducto } from '../../interfaces/producto.interface';
import { MessageService } from 'primeng/api';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-modal-busqueda-producto',
  templateUrl: './modal-busqueda-producto.component.html',
  styleUrls: ['./modal-busqueda-producto.component.css']
})
export class ModalBusquedaProductoComponent implements OnInit, OnDestroy {
  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm();
  listModelo: IProducto[];
  listModeloGenerico: IProducto[];

  seleccionItem: IProducto;

  isVisualizar: boolean = false;

  columnas: any;
  columnasGenerico: any;

  formularioBusqueda: FormGroup;
  formularioVisor: FormGroup;

  subscription$: Subscription;

  loading: boolean;
  loadingGenerico: boolean;

  @Input() isCodAlmacen: string;
  @Input() isCodAseguradora: string;
  @Input() isCodContratante: string;

  @Output() eventoAceptar = new EventEmitter<IProducto>();
  @Output() eventoCancelar = new EventEmitter<IProducto>();

  constructor(private ventaCompartidoService: VentaCompartidoService,
              private readonly fb: FormBuilder,
              public readonly messageService: MessageService) { }

  ngOnInit(): void {
    this.seleccionItem = null;
    this.listModeloGenerico = [];
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
      { field: 'codproducto', header: 'Código' },
      { field: 'lote', header: 'Lote' },
      { field: 'itemName', header: 'Nombre' },
      { field: 'u_SYP_CS_LABORATORIO', header: 'Laboratorio' },
      { field: 'avgStdPrice', header: 'Precio' },
      { field: 'quantityOnStock', header: 'Stock' }
    ];

    this.columnasGenerico = [
      { field: 'codproducto', header: 'Código' },
      { field: 'lote', header: 'Lote' },
      { field: 'itemName', header: 'Nombre' },
      { field: 'u_SYP_CS_LABORATORIO', header: 'Laboratorio' },
      { field: 'avgStdPrice', header: 'Precio' },
      { field: 'quantityOnStock', header: 'Stock' }
    ];
  }

  getProductoPorCodigo() {
    const formBody = this.formularioVisor.value;

    if (this.isCodAlmacen === null) {
      this.messageService.add({severity:'info', summary: this.globalConstants.msgInfoSummary, detail:`Ingresar Almacén a consultar`});
      return;
    }

    if (formBody.nombreVisor === null) {
      this.messageService.add({severity:'info', summary: this.globalConstants.msgInfoSummary, detail:`Ingresar Código a consultar`});
      return;
    }

    if (formBody.nombreVisor.length === 0) {
      this.messageService.add({severity:'info', summary: this.globalConstants.msgInfoSummary, detail:`Ingresar Código a consultar`});
      return;
    }

    if (formBody.nombreVisor.length !== 8) {
      this.messageService.add({severity:'info', summary: this.globalConstants.msgInfoSummary, detail:`Código a consultar Incorrecto`});
      return;
    }

    // Enviar Almacen
    // isCodAlmacen

    this.subscription$ = new Subscription();
    this.subscription$ = this.ventaCompartidoService.getListProductoPorFiltro(this.isCodAlmacen, formBody.nombreVisor, '', this.isCodAseguradora, this.isCodContratante)
    .subscribe((data: IProducto[]) => {
      this.eventoAceptar.emit(data[0]);
      this.LimpiarFiltroBusqueda();
    },
    (error) => {
      this.messageService.add({severity:'error', summary: this.globalConstants.msgErrorSummary, detail:error.error.resultadoDescripcion});
    });
  }

  getListProductoPorFiltro() {
    const formBody = this.formularioBusqueda.value;

    if (this.isCodAlmacen === null) {
      this.messageService.add({severity:'info', summary: this.globalConstants.msgInfoSummary, detail:`Ingresar Almacén a consultar`});
      return;
    }

    if (formBody.codigo.length === 0 && formBody.nombre.length === 0) {
      this.messageService.add({severity:'info', summary: this.globalConstants.msgInfoSummary, detail:`Ingresar Nombre o Código a consultar`});
      return;
    }

    if (formBody.codigo.length === 0 && formBody.nombre.length < 3) {
      this.messageService.add({severity:'info', summary: this.globalConstants.msgInfoSummary, detail:`Nombre debe de tener 3 caracteres como minímo`});
      return;
    }

    if (formBody.codigo.length > 0 && formBody.codigo.length < 8) {
      this.messageService.add({severity:'info', summary: this.globalConstants.msgInfoSummary, detail:`Código tiene 8 caracteres`});
      return;
    }

    // Enviar Almacen
    // isCodAlmacen

    this.loading = true;
    this.subscription$ = new Subscription();
    this.subscription$ = this.ventaCompartidoService.getListProductoPorFiltro(this.isCodAlmacen, formBody.codigo, formBody.nombre, this.isCodAseguradora, this.isCodContratante)
    .pipe(
      map((data: IProducto[])=> {
        this.listModelo = [];
        this.listModelo = data;

        console.log('this.listModelo', this.listModelo);

        this.listModeloGenerico = [];
      this.loading = false;
      }
    ))
    .subscribe(()=> {},
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
      this.listModeloGenerico = [];
      this.listModeloGenerico = data;
      this.loadingGenerico = false;
    },
    (error) => {
      this.loadingGenerico = false;
    });
  }

  goClearGenerico() {
    this.listModeloGenerico = [];
  }

  clickAceptar() {
    this.formularioVisor.patchValue({
      nombreVisor: this.seleccionItem.codproducto
    });
    this.isVisualizar = false;
    this.eventoAceptar.emit(this.seleccionItem);
    this.LimpiarFiltroBusqueda();
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

    this.listModelo = [];
    this.goClearGenerico();
  }

  ngOnDestroy() {
    if (this.subscription$) {
      this.subscription$.unsubscribe();
    }
  }

}
