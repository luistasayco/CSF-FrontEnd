import { Component, EventEmitter, OnInit, Output, OnDestroy, Input, OnChanges, SimpleChanges } from '@angular/core';
import { GlobalsConstantsForm } from '../../../../../constants/globals-constants-form';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { IPaciente } from '../../interfaces/paciente.interface';
import { VentaCompartidoService } from '../../services/venta-compartido.service';
import { IAtencion } from '../../interfaces/atencion.interface';
import { map } from 'rxjs/operators';
import { MensajePrimeNgService } from '../../../../../services/mensaje-prime-ng.service';

@Component({
  selector: 'app-modal-busqueda-atencion-paciente',
  templateUrl: './modal-busqueda-atencion-paciente.component.html',
  styleUrls: ['./modal-busqueda-atencion-paciente.component.css']
})
export class ModalBusquedaAtencionPacienteComponent implements OnInit, OnDestroy,OnChanges {
  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm();
  isVisualizar: boolean = false;
  //Columnas de la tabla
  columnas: any;
  formularioBusqueda: FormGroup;
  formularioVisor: FormGroup;
  listModelo: IAtencion[];
  modeloPaciente: IPaciente;

  seleccionItem: IAtencion;
  subscription$: Subscription;
  loading: boolean;

  @Input() isHabilitaControl: boolean = false;
  @Output() eventoResgistroSeleccionado = new EventEmitter<IPaciente>();
  @Output() eventoCancelar = new EventEmitter<IPaciente>();

  constructor(private ventaCompartidoService: VentaCompartidoService,
              private readonly fb: FormBuilder,
              private readonly mensajePrimeNgService: MensajePrimeNgService) { }

  ngOnChanges() {
    if (this.formularioVisor) {
      this.formularioVisor.controls.nombreVisor.setValue('');
      if (this.isHabilitaControl) {
        this.formularioVisor.controls.nombreVisor.disable();
      } else {
        this.formularioVisor.controls.nombreVisor.enable();
      }
    }
  }
 
  ngOnInit(): void {
    this.buildColumnas();
    this.buildFormVisor()
    this.buildForm();
  }

  private buildFormVisor() {
    this.formularioVisor = this.fb.group({
      nombreVisor: [''],
    });
  }

  private buildForm() {
    this.formularioBusqueda = this.fb.group({
      opcion: ['CODIGO'],
      codigo: [null],
      nombre: [null],
    });
  }
 
  private buildColumnas() {
    this.columnas = [
      { field: 'atencion', header: 'Atención' },
      { field: 'nombrepaciente', header: 'Nombre' },
      { field: 'estadopaciente', header: 'Estado' },
      { field: 'finicio', header: 'Fecha' },
      { field: 'codpaciente', header: 'Cod. Paciente' }
    ];
  }

  getListPacientePorFiltros() {
    const formBody = this.formularioBusqueda.value;
    this.loading = true;
    this.subscription$ = new Subscription();
    this.subscription$ = this.ventaCompartidoService.getListPacientePorFiltros(formBody.opcion, formBody.codigo, formBody.nombre)
    .subscribe((data: IAtencion[]) => {
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
      nombreVisor: this.seleccionItem.atencion
    });
    this.getPacientePorAtencion(this.seleccionItem.atencion, true);
    this.habilitarBusqueda();
  }

  goEnterPacientePorAtencion() {
    const body = this.formularioVisor.value;
    if (body.nombreVisor.length === 8) {
      this.getPacientePorAtencion(body.nombreVisor, false);
    }
  }

  getPacientePorAtencion(codAtencion: string, modalVisible: boolean) {
    this.subscription$ = new Subscription();
    this.subscription$ = this.ventaCompartidoService.getPacientePorAtencion(codAtencion)
    .pipe(
      map(resp => {
        this.modeloPaciente = resp;
        this.eventoResgistroSeleccionado.emit(this.modeloPaciente);
      })
    )
    .subscribe(
      (resp) => {},
      (error) => {
      this.mensajePrimeNgService.onToErrorMsg(null, error.error);
      if (modalVisible) {
        this.clickCancelar();
      }
    });
  }

  habilitarBusqueda() {
    this.isVisualizar =! this.isVisualizar;
  }

  clickCancelar() {
    this.LimpiarFiltroBusqueda();
    this.habilitarBusqueda();
    this.eventoCancelar.emit();
  }

  private LimpiarFiltroBusqueda() {
    this.formularioBusqueda.patchValue({
      opcion: 'CODIGO',
      codigo: '',
      nombre: ''
    });
    this.listModelo = [];
  }

  ngOnDestroy() {
    if (this.subscription$) {
      this.subscription$.unsubscribe();
    }
  }
}
