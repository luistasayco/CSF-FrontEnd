import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { GlobalsConstantsForm } from '../../../../../constants/globals-constants-form';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ICliente } from '../../interfaces/cliente.interface';
import { VentaCompartidoService } from '../../services/venta-compartido.service';
import swal from'sweetalert2';

@Component({
  selector: 'app-modal-busqueda-doc-identidad',
  templateUrl: './modal-busqueda-doc-identidad.component.html',
  styleUrls: ['./modal-busqueda-doc-identidad.component.css']
})
export class ModalBusquedaDocIdentidadComponent implements OnInit, OnDestroy {
  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm();
  
  //Columnas de la tabla
  columnas: any;
  formularioBusqueda: FormGroup;
  formularioVisor: FormGroup;
  listTipoDocumento:any[];
  //listModelo: ICliente[];

  seleccionItem: any;
  subscription$: Subscription;
  loading: boolean;

  @Input() isHabilitaControl: boolean;
  @Output() eventoAceptar = new EventEmitter<ICliente>();
  @Output() eventoCancelar = new EventEmitter<ICliente>();
  constructor(private ventaCompartidoService: VentaCompartidoService,
              private readonly fb: FormBuilder) { }

ngOnInit(): void {
    this.buildColumnas();
    this.buildForm();
    this.ListTipoDocumentoIdentidadPorFiltro();
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
      { field: 'codigo', header: 'Código' },
      { field: 'nombre', header: 'Nombre' }
    ];
  }

  ListTipoDocumentoIdentidadPorFiltro() {

    this.listTipoDocumento=[
      {codigo:0,nombre:'Otros Tipos de Documentos'},
      {codigo:1,nombre:'(DNI)Documento Nacional de Indentidad'},
      {codigo:4,nombre:'Carnet de Extranjeria'},
      {codigo:6,nombre:'Registro Unico de Contribuyentes'},
      {codigo:7,nombre:'Pasaporte'}
      // {codigo:'A',nombre:'Cédula Diplomática de Identidad'},
      // {codigo:'B',nombre:'Doc.Ident.Pais.Residencia-NO.D'},
      // {codigo:'C',nombre:'Tax Identification Number-TIN-Doc Trib PP.NN'},
      // {codigo:'D',nombre:'Identification Number-IN-Doc Trib PP.JJ'},
      // {codigo:'E',nombre:'Tarjeta Andina de Migración'}
      ];

  }

  clickAceptar() {
    
    this.isHabilitaControl = false;
    this.eventoAceptar.emit(this.seleccionItem);
  }

  clickCancelar() {
    
    this.isHabilitaControl = false;
    this.eventoCancelar.emit();
  }



  ngOnDestroy() {
    if (this.subscription$) {
      this.subscription$.unsubscribe();
    }
  }

}
