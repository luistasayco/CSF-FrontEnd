import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { GlobalsConstantsForm } from '../../../../../constants/globals-constants-form';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { VentasService } from '../../../../modulo-venta/services/ventas.service';
import { map } from 'rxjs/operators';
import { IResultBusquedaComprobante } from '../../../../modulo-venta/interface/comprobante.interface';
import swal from'sweetalert2';

@Component({
  selector: 'app-modal-busqueda-nota-credito-devolucion',
  templateUrl: './modal-busqueda-nota-credito-devolucion.component.html',
  styleUrls: ['./modal-busqueda-nota-credito-devolucion.component.css']
})
export class ModalBusquedaNotaCreditoDevolucionComponent implements OnInit {
  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm();

  formulario: FormGroup;

  @Output() eventoAceptar= new EventEmitter<boolean>();
  @Output() eventoCancelar = new EventEmitter<boolean>();

  isHabilitaValidacion: boolean;

  subscription$: Subscription;

  constructor(private readonly fb: FormBuilder,
              private readonly ventasService: VentasService) { }

  ngOnInit(): void {
    this.buildForm();
  }

  private buildForm() {
    this.formulario = this.fb.group({
      comprobante: new FormControl('', Validators.compose([Validators.required, Validators.minLength(12)]))
    });
  }

  goAceptar() {
    this.goListar();
  }

  goListar() {
    let body = this.formulario.value;
    this.isHabilitaValidacion = true;
    this.subscription$ = new Subscription();
    this.subscription$ = this.ventasService.getListaComprobantesPorFiltro(body.codcomprobante, body.fechaIni, body.fechaFin, 1)
    .pipe(
      map((resp: IResultBusquedaComprobante[]) => {
          this.isHabilitaValidacion = false;
          if (resp.length === 0) {
            swal.fire(this.globalConstants.msgErrorSummary, 'No existe Comprobante o verifique el estado','error');
            return;
          } else {
            this.onValidaciones(resp[0]);
          }
        }
      )
    )
    .subscribe(  
    (resp) => {},
    (error) => {
      this.isHabilitaValidacion = false;
      swal.fire(this.globalConstants.msgErrorSummary, error.error.resultadoDescripcion,'error');
    });
  }

  onValidaciones(value: IResultBusquedaComprobante) {
    if (value.codtipocliente !== '01') {
      swal.fire(this.globalConstants.msgErrorSummary, 'Solo puede realizar Nota de Crédito a TIPOCLIENTE PACIENTE con atenciones A y E.','error');
      return;
    }

    if (value.codatencion === '' || value.codatencion === undefined || value.codatencion === null){
      swal.fire(this.globalConstants.msgErrorSummary, 'Solo se permite las notas de Crédito/Débito de los" & vbCrLf & "pacientes con atenciones A y E.','error');
      return;
    }

    if (value.codatencion.substring(0,1) === 'H' || value.codatencion.substring(0,1) === 'E'){
      
    }
  }

  goSalir() {
    this.eventoCancelar.emit(false);
  }

  ngOnDestroy() {
    if (this.subscription$) {
      this.subscription$.unsubscribe();
    }
  }
}
