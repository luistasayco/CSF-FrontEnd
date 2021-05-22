import { Component, Input, OnInit, OnDestroy, OnChanges } from '@angular/core';
import { GlobalsConstantsForm } from '../../../../../constants/globals-constants-form';
import { FormGroup, FormBuilder } from '@angular/forms';
import { VentaCompartidoService } from '../../services/venta-compartido.service';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { IProducto } from '../../interfaces/producto.interface';
import { IStock } from '../../interfaces/stock.interface';
import { ConstantesGenerales } from '../../../../../constants/Constantes-generales';
import swal from'sweetalert2';

@Component({
  selector: 'app-modal-consulta-producto',
  templateUrl: './modal-consulta-producto.component.html',
  styleUrls: ['./modal-consulta-producto.component.css']
})
export class ModalConsultaProductoComponent implements OnInit, OnDestroy, OnChanges {
  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm();

  @Input() isModeloStock: IStock;
  @Input() isVisualizarProducto: boolean = false;
  modelo: IProducto;
  listStock: IStock[];

  columnas: any;

  formulario: FormGroup;

  loading: boolean;
  subscription$: Subscription;

  timeAnimationModal = ConstantesGenerales.DURACION_ANIMACION_MODAL;
  
  constructor(private ventaCompartidoService: VentaCompartidoService,
              private readonly fbc: FormBuilder) { }

  ngOnChanges() {
    if (this.isVisualizarProducto) {
      console.log('Ingreso la cabesita');
      console.log('isModeloStock', this.isModeloStock);
      
      this.getListProductoPorFiltro();
    }
  }
          
  ngOnInit(): void {
    this.listStock = [];
    this.buildForm();
    this.buildColumnas();
    
  }

  private buildForm() {
    this.formulario = this.fbc.group({
      codigo: [{value: null, disabled: true}],
      nombre: [{value: null, disabled: true}],
      precio: [{value: 0, disabled: true}],
      stock: [{value: 0, disabled: true}],
      solicitado: [{value: 0, disabled: true}],
      reservado: [{value: 0, disabled: true}]
    });
  }

  private buildColumnas() {
    this.columnas = [
      { field: 'whsCode', header: 'Almacén' },
      // { field: 'OnHand', header: 'Stock' },
      // { field: 'OnOrder', header: 'Stock Solicitado' },
      // { field: 'IsCommited', header: 'Stock Reservado' },
      { field: 'onHand_1', header: 'Stock' },
      { field: 'isCommited_1', header: 'Solicitado' },
      { field: 'onOrder_1', header: 'Reservado' }
    ];
  }

  getListProductoPorFiltro() {
    this.loading = true;
    this.subscription$ = new Subscription();
    this.subscription$ = this.ventaCompartidoService.getProductoyStockAlmacenesPorCodigo(this.isModeloStock.itemCode)
    .pipe(
      map((data: IProducto)=> {
        this.listStock = data.listStockAlmacen;
        this.goSetDatosProducto();
        this.loading = false;
      }
    ))
    .subscribe(()=> {},
    (error) => {
      this.loading = false;
      swal.fire(this.globalConstants.msgInfoSummary,error.error.resultadoDescripcion,'error')
    });
  }

  goSetDatosProducto() {
    // this.formulario.controls.codigo.setValue(this.isModeloStock.itemCode);
    this.formulario.patchValue({
      codigo: this.isModeloStock.itemCode,
      nombre: this.isModeloStock.itemName,
      precio: this.isModeloStock.price,
      stock: this.isModeloStock.onHand,
      solicitado: this.isModeloStock.onOrder,
      reservado: this.isModeloStock.isCommited
    });
  }

  ngOnDestroy() {
    if (this.subscription$) {
      this.subscription$.unsubscribe();
    }
  }
}
