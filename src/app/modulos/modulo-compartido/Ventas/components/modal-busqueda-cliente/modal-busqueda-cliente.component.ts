import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { GlobalsConstantsForm } from '../../../../../constants/globals-constants-form';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ICliente } from '../../interfaces/cliente.interface';
import { VentaCompartidoService } from '../../services/venta-compartido.service';
import { UtilService } from '../../../../../services/util.service';
import swal from'sweetalert2';

@Component({
  selector: 'app-modal-busqueda-cliente',
  templateUrl: './modal-busqueda-cliente.component.html',
  styleUrls: ['./modal-busqueda-cliente.component.css']
})
export class ModalBusquedaClienteComponent implements OnInit, OnDestroy {
  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm();
  //isVisualizar: boolean = false;
  //Columnas de la tabla
  columnas: any;
  formularioBusqueda: FormGroup;
  formularioVisor: FormGroup;
  listModelo: ICliente[];

  seleccionItem: ICliente;
  subscription$: Subscription;
  loading: boolean;
  

  @Input() isHabilitaControl = false;
  @Output() eventoAceptar = new EventEmitter<ICliente>();
  @Output() eventoCancelar = new EventEmitter<ICliente>();
  constructor(private ventaCompartidoService: VentaCompartidoService,
              private readonly fb: FormBuilder,
              private readonly utilService: UtilService) { }

ngOnInit(): void {
    this.buildColumnas();
    this.buildFormVisor()
    this.buildForm();
  }

  private buildFormVisor() {
    // this.formularioVisor = this.fb.group({
    //   nombreVisor: [null],
    // });
  }

  private buildForm() {
    this.formularioBusqueda = this.fb.group({
      opcion: ['NOMBRE'],
      codigo: [null],
      nombre: [null],
    });
  }
 
  private buildColumnas() {
    this.columnas = [
      { field: 'cardCode', header: 'Código' },
      { field: 'cardName', header: 'Nombre' },
      { field: 'federalTaxID', header: 'RUC/DNI' },
      { field: 'phone1', header: 'Telefono' },
      { field: 'address', header: 'Dirección' },
      { field: 'mailAddress', header: 'Correo' }
    ];
  }

  goListClientePorFiltro() {
    const formBody = this.formularioBusqueda.value;

    let codigo: string = '';
    let nombre: string = '';

    if (formBody.opcion === 'RUC') {
      codigo = formBody.codigo === null ? '': this.utilService.convertirMayuscula(formBody.codigo);
    } else {
      nombre = formBody.nombre === null ? '': this.utilService.convertirMayuscula(formBody.nombre);
    }

    this.loading = true;
    this.subscription$ = new Subscription();
    this.subscription$ = this.ventaCompartidoService.getListClienteLogisticaPorFiltro(codigo, nombre)
    .subscribe((data: ICliente[]) => {
      this.listModelo = [];
      this.listModelo = data;
      this.loading = false;
    },
    (error) => {
      this.loading = false;
      swal.fire(this.globalConstants.msgInfoSummary,error.error.resultadoDescripcion,'error')
    });
  }

  clickAceptar() {
    // this.LimpiarFiltroBusqueda();
    // this.formularioVisor.patchValue({
    //   nombreVisor: this.seleccionItem.cardName
    // });
    this.isHabilitaControl = false;
    this.eventoAceptar.emit(this.seleccionItem);
  }

  clickCancelar() {
    //this.LimpiarFiltroBusqueda();
    this.isHabilitaControl = false;
    this.eventoCancelar.emit();
  }

  // private LimpiarFiltroBusqueda() {
  //   this.formularioBusqueda.patchValue({
  //     nombre: ''
  //   });
  // }

  ngOnDestroy() {
    if (this.subscription$) {
      this.subscription$.unsubscribe();
    }
  }

 


}
