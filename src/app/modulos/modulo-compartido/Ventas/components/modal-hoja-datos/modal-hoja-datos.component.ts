import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { GlobalsConstantsForm } from '../../../../../constants/globals-constants-form';
import { Subscription } from 'rxjs';
import swal from'sweetalert2';
import { HttpEventType } from '@angular/common/http';
import { VentaCompartidoService } from '../../services/venta-compartido.service';

@Component({
  selector: 'app-modal-hoja-datos',
  templateUrl: './modal-hoja-datos.component.html',
  styleUrls: ['./modal-hoja-datos.component.css']
})
export class ModalHojaDatosComponent implements OnInit , OnDestroy{

  @Input() isLayoutIcono: boolean;
  @Input() isCodAtencion: string;

  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm;

  isDisplayVisualizar: boolean;
  isDisplayVisualizarDocumento: boolean;
  subscription$: Subscription;
  isDataBlob: Blob;

  constructor(private readonly ventaCompartidoService: VentaCompartidoService) { }

  ngOnInit(): void {
  }

  goGenerarHojaDatos() {
    if (this.isCodAtencion === null || this.isCodAtencion === undefined) {
      swal.fire(this.globalConstants.msgExitoSummary, 'Ingresar Atención...!!!', 'error');
      return;
    }

    this.isDisplayVisualizar =! this.isDisplayVisualizar;

    this.subscription$ = new Subscription();
    this.subscription$  = this.ventaCompartidoService.getGenerarHojaDatosPrint( this.isCodAtencion )
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

  ngOnDestroy() {
    if (this.subscription$) {
      this.subscription$.unsubscribe();
    }
  }

}
