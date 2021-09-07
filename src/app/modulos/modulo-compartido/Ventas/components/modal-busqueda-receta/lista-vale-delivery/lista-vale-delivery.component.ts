import { Component, EventEmitter, OnInit, Output, OnDestroy, Input } from '@angular/core';
import { GlobalsConstantsForm } from '../../../../../../constants/globals-constants-form';
import { IValeDelivery } from '../../../../../modulo-venta/interface/vale-delivery';
import { Subscription } from 'rxjs';
import { VentaCompartidoService } from '../../../services/venta-compartido.service';
import { UserContextService } from '../../../../../../services/user-context.service';
import { VentasService } from '../../../../../modulo-venta/services/ventas.service';
import { map } from 'rxjs/operators';
import { FormGroup, FormBuilder } from '@angular/forms';
import { LanguageService } from '../../../../../../services/language.service';
import swal from'sweetalert2';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-lista-vale-delivery',
  templateUrl: './lista-vale-delivery.component.html',
  styleUrls: ['./lista-vale-delivery.component.css']
})
export class ListaValeDeliveryComponent implements OnInit, OnDestroy {
  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm();

  columnas: any;
  listModelo: IValeDelivery[];
  isModeloValeDelivery: IValeDelivery;

  // loading
  loading: boolean;
  // Subscription
  isDisplayVisualizar: boolean;
  isDisplayVisualizarDocumento: boolean;
  subscription$: Subscription;
  isDataBlob: Blob;
  formularioBusqueda: FormGroup;

  isVisibleValeDelivery: boolean;

  @Input() append: any;
  @Output() eventCancelar = new EventEmitter<boolean>();

  constructor(private readonly ventaService: VentasService,
              private readonly formBuilder: FormBuilder,
              private readonly userContextService: UserContextService,
              public lenguageService: LanguageService) { }

  ngOnInit(): void {
    this.buildColumnas();
    this.buildForm();
    this.goListValeDeliveryPorRangoFecha();
  }

  private buildForm() {
    this.formularioBusqueda = this.formBuilder.group({
      fechaIni: [new Date],
      fechaFin: [new Date]
    });
  }

  private buildColumnas() {
    this.columnas = [
      { field: 'idvaledelivery', header: 'Id' },
      { field: 'codatencion', header: 'Cod.Atencion' },
      { field: 'nombrepaciente', header: 'Nombre Paciente' },
      { field: 'telefono', header: 'Telefono' },
      { field: 'celular', header: 'Celular' },
      { field: 'direccion', header: 'Dirección' },
      { field: 'distrito', header: 'Distrito' },
      { field: 'referencia', header: 'Referencia' }
    ];
  }

  goListValeDeliveryPorRangoFecha() {
    let body = this.formularioBusqueda.value;

    this.subscription$ = new Subscription();
    this.subscription$ = this.ventaService.getListValeDeliveryPorRangoFecha(body.fechaIni, body.fechaFin)
    .pipe(
      map((resp: IValeDelivery[]) => {
        this.listModelo = [];
        this.listModelo = resp;
      })
    )
    .subscribe((resp) => {},
    (error) => {
      swal.fire(this.globalConstants.msgErrorSummary, error.error.resultadoDescripcion,'error')
    });
  }

  goGenerarPrintReporte1() {
    let body = this.formularioBusqueda.value;
    this.isDisplayVisualizar =! this.isDisplayVisualizar;

    this.subscription$ = new Subscription();
    this.subscription$  = this.ventaService.getGenerarValeValeDeliveryReporte1Print( body.fechaIni, body.fechaFin )
    .subscribe((resp: any) =>  {

      switch (resp.type) {
        case HttpEventType.DownloadProgress:
          break;
        case HttpEventType.Response:
          this.isDataBlob = new Blob([resp.body], {type: resp.body.type});
          this.isDisplayVisualizar =! this.isDisplayVisualizar;

          this.isDisplayVisualizarDocumento = !this.isDisplayVisualizarDocumento;
          break;
      }
    },
      (error) => {
        this.isDisplayVisualizar =! this.isDisplayVisualizar;
        swal.fire(this.globalConstants.msgErrorSummary,error.error.resultadoDescripcion, 'error');
    });

  }

  goGenerarPrintReporte2() {
    let body = this.formularioBusqueda.value;
    this.isDisplayVisualizar =! this.isDisplayVisualizar;

    this.subscription$ = new Subscription();
    this.subscription$  = this.ventaService.getGenerarValeValeDeliveryReporte2Print( body.fechaIni, body.fechaFin )
    .subscribe((resp: any) =>  {

      switch (resp.type) {
        case HttpEventType.DownloadProgress:
          break;
        case HttpEventType.Response:
          this.isDataBlob = new Blob([resp.body], {type: resp.body.type});
          this.isDisplayVisualizar =! this.isDisplayVisualizar;

          this.isDisplayVisualizarDocumento = !this.isDisplayVisualizarDocumento;
          break;
      }
    },
      (error) => {
        this.isDisplayVisualizar =! this.isDisplayVisualizar;
        swal.fire(this.globalConstants.msgErrorSummary,error.error.resultadoDescripcion, 'error');
    });

  }


  goModificar(value: IValeDelivery) {
    this.isModeloValeDelivery = value;
    this.isVisibleValeDelivery = !this.isVisibleValeDelivery;
  }

  goCancelar() {
    this.eventCancelar.emit(false);
  }

  goValeDeliveryAceptar() {
    this.isVisibleValeDelivery = !this.isVisibleValeDelivery;
  }

  goValeDeliveryCancelar() {
    this.isVisibleValeDelivery = !this.isVisibleValeDelivery;
  }

  ngOnDestroy() {
    if (this.subscription$) {
      this.subscription$.unsubscribe();
    }
  }

}
