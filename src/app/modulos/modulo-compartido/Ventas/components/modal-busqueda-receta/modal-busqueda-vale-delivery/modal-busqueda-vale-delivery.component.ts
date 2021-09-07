import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { GlobalsConstantsForm } from '../../../../../../constants/globals-constants-form';
import { IPaciente } from '../../../interfaces/paciente.interface';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { LanguageService } from '../../../../../../services/language.service';
import { VentasService } from '../../../../../modulo-venta/services/ventas.service';
import { IValeDelivery } from '../../../../../modulo-venta/interface/vale-delivery';
import { map } from 'rxjs/operators';
import swal from'sweetalert2';

@Component({
  selector: 'app-modal-busqueda-vale-delivery',
  templateUrl: './modal-busqueda-vale-delivery.component.html',
  styleUrls: ['./modal-busqueda-vale-delivery.component.css']
})
export class ModalBusquedaValeDeliveryComponent implements OnInit, OnDestroy {

  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm();

  @Input() isAtencion: string;
  @Input() isAppendVale: any;

  formularioVale: FormGroup;
  // Subscription
  subscription$: Subscription;

  @Output() eventAceptar = new EventEmitter<boolean>();
  @Output() eventCancelar = new EventEmitter<boolean>();
  
  constructor(private readonly fb: FormBuilder,
              public lenguageService: LanguageService,
              private readonly ventaService: VentasService) { }

  ngOnInit(): void {
    debugger;

    this.buildForm();
    this.goValeDeliveryPorCodAtencion();
  }

  private buildForm() {
    this.formularioVale = this.fb.group({
      idvaledelivery: [{value: 0, disabled: true}],
      codatencion: [{value: null, disabled: true}],
      
      nombrepaciente: [{value: null, disabled: true}],
      telefono: [{value: null, disabled: true}],
      celular: [{value: null, disabled: true}],
      direccion: [{value: null, disabled: true}],
      distrito: [{value: null, disabled: true}],
      referencia: [{value: null, disabled: true}],
      fechaentrega: [{value: new Date(), disabled: true}],
      lugarentrega: [{value: null, disabled: false}],
      prioridad_1: [{value: null, disabled: false}],
      prioridad_2: [{value: null, disabled: false}],
      estado: [{value: false, disabled: false}],
    });
  }

  goValeDeliveryPorCodAtencion() {
    this.subscription$ = new Subscription();
    this.subscription$ = this.ventaService.getListValeDeliveryPorCodAtencion(this.isAtencion)
    .pipe(
      map((resp: IValeDelivery[]) => {

        if (resp.length === 0) {
          swal.fire(this.globalConstants.msgInfoSummary, 'No existe registro de Vale Delivery, <br> Realizar el Registro del Vale Delivery en la Generación de Venta', 'info');

         this.eventCancelar.emit(false);
         return;
        }

        this.onSetearDatosValeDelivery(resp[0]);
      })
    )
    .subscribe((resp) => {},
    (error) => {
      swal.fire(this.globalConstants.msgErrorSummary, error.error.resultadoDescripcion,'error')
    });
  }

  onSetearDatosValeDelivery(resp: IValeDelivery) {
    this.formularioVale.patchValue({
      idvaledelivery: resp.idvaledelivery,
      codatencion: resp.codatencion,
      nombrepaciente: resp.nombrepaciente,
      telefono: resp.telefono,
      celular: resp.celular,
      direccion: resp.direccion,
      distrito: resp.distrito,
      referencia: resp.referencia,
      fechaentrega: new Date(resp.fechaentrega),
      lugarentrega: resp.lugarentrega,
      prioridad_1: resp.prioridad_1,
      prioridad_2: resp.prioridad_2,
      estado: resp.estado
    });
  }

  goAceptar() {
    const data = this.formularioVale.getRawValue();

    let body: IValeDelivery = {
      idvaledelivery: data.idvaledelivery,
      codatencion: data.codatencion,
      nombrepaciente: data.nombrepaciente,
      telefono: data.telefono,
      celular: data.celular,
      direccion: data.direccion,
      distrito: data.distrito,
      referencia: data.referencia,
      fechaentrega: data.fechaentrega,
      lugarentrega: data.lugarentrega,
      prioridad_1: data.prioridad_1,
      prioridad_2: data.prioridad_2,
      estado: data.estado,
    }

    this.onModificar(body);
    
  }

  onModificar(data: IValeDelivery) {
    this.subscription$ = new Subscription();
    this.subscription$  = this.ventaService.setModificarValeDelivery( data )
    .subscribe(() =>  {
      swal.fire(this.globalConstants.msgExitoSummary, this.globalConstants.msgExitoDetail, 'success');

    },
      (error) => {
        swal.fire(this.globalConstants.msgErrorSummary,error.error.resultadoDescripcion, 'error');
    });
  }

  goCancelar() {
    this.eventCancelar.emit(false);
  }

  ngOnDestroy() {
    if (this.subscription$) {
      this.subscription$.unsubscribe();
    }
  }
}
