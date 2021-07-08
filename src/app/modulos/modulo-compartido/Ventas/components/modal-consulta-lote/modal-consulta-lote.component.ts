import { Component, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import swal from'sweetalert2';
import { GlobalsConstantsForm } from '../../../../../constants/globals-constants-form';
import { Subscription } from 'rxjs';
import { IStock } from '../../interfaces/stock.interface';
import { VentaCompartidoService } from '../../services/venta-compartido.service';
import { map } from 'rxjs/operators';
import { IVentaDetalleLote } from '../../../../modulo-venta/interface/venta.interface';

@Component({
  selector: 'app-modal-consulta-lote',
  templateUrl: './modal-consulta-lote.component.html',
  styleUrls: ['./modal-consulta-lote.component.css']
})
export class ModalConsultaLoteComponent implements OnInit, OnDestroy {
  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm();

  @Input() isVisualizar: boolean;
  @Input() isActivoVenta: boolean;
  @Input() isActivoVentaDetalleLote: boolean;
  @Input() isCodProducto: string;
  @Input() isCodAlmacen: string;
  @Input() isCantidadInput: number;
  @Input() isListVentaDetalleLote: IVentaDetalleLote[];

  @Input() isListLoteVta: IStock[];

  // Lista
  listModelo: any[];
  columnas: any;
  loading: boolean;

  subscription$: Subscription;

  @Output() eventoAceptar = new EventEmitter<IStock[]>();
  @Output() eventoSalir = new EventEmitter<boolean>();

  constructor(private ventaCompartidoService: VentaCompartidoService) { }

  ngOnInit(): void {
    debugger;
    this.buildColumnas();
    if (!this.isActivoVentaDetalleLote) {
      this.getListLotePorFiltro();
    }
    if (this.isActivoVentaDetalleLote) {
      this.onListaDetalleLoteVenta();
    }
  }

  private buildColumnas() {
    if (!this.isActivoVenta && !this.isActivoVentaDetalleLote) {
      this.columnas = [
        { field: 'batchNum', header: 'Lote' },
        { field: 'expDate', header: 'Fecha Vencimiento' },
        { field: 'quantityLote', header: 'Cantidad' }
      ];
    }
    
    if (this.isActivoVenta && !this.isActivoVentaDetalleLote) {
      this.columnas = [
        { field: 'batchNum', header: 'Lote' },
        { field: 'expDate', header: 'Fecha Vencimiento' },
        { field: 'quantityLote', header: 'Cantidad' },
        { field: 'quantityinput', header: 'Cantidad a vender' }
      ];
    }

    if (!this.isActivoVenta && this.isActivoVentaDetalleLote) {
      this.columnas = [
        { field: 'lote', header: 'Lote' },
        { field: 'fechavencimiento', header: 'Fecha Vencimiento' },
        { field: 'cantidad', header: 'Cantidad' }
      ];
    }
  }

  getListLotePorFiltro() {
    this.loading = true;
    this.subscription$ = new Subscription();
    this.subscription$ = this.ventaCompartidoService.getListStockLotePorFiltro(this.isCodAlmacen, this.isCodProducto, true)
    .pipe(
      map((data: IStock[])=> {
        this.listModelo = data;

        if (this.isActivoVenta) {
          if (this.isListLoteVta !== null) {
            if (this.isListLoteVta !== undefined) {
              if (this.isListLoteVta.length > 0) {
                this.isListLoteVta.forEach( xFila => {
                  this.listModelo.find(xFind => xFind.batchNum === xFila.batchNum).quantityinput = xFila.quantityinput;
                });
              }
              else {
                this.onAsignaCantidadLote();
              }
            }
            else {
              this.onAsignaCantidadLote();
            }
          } else {
            this.onAsignaCantidadLote();
          }
        }
        this.loading = false;
      }
    ))
    .subscribe(()=> {},
    (error) => {
      this.loading = false;
      swal.fire(this.globalConstants.msgInfoSummary,error.error.resultadoDescripcion,'error')
    });
  }

  onAsignaCantidadLote() {
    this.listModelo.forEach(xFila => {

      xFila.quantityLote = xFila.quantityLote === null ? 0 : xFila.quantityLote;
      xFila.quantityLote = xFila.quantityLote === undefined ? 0 : xFila.quantityLote;

      if (this.isCantidadInput > 0) {

        if (this.isCantidadInput <= xFila.quantityLote) {
          xFila.quantityinput = this.isCantidadInput;
          this.isCantidadInput = 0;
        } else {
          xFila.quantityinput = 0;

          // Obteniendo diferencia
          let newResul = (this.isCantidadInput - xFila.quantityLote)

          xFila.quantityinput = this.isCantidadInput - newResul;
          this.isCantidadInput = newResul;
        }

      }
    });
    this.loading = false;
  }

  onListaDetalleLoteVenta() {
    this.listModelo = this.isListVentaDetalleLote;
  }

  goAceptar() {
    this.eventoAceptar.emit(this.listModelo);
  }


  goSalir() {
    this.eventoSalir.emit(true);
  }
  
  ngOnDestroy() {
    if (this.subscription$) {
      this.subscription$.unsubscribe();
    }
  }
}
