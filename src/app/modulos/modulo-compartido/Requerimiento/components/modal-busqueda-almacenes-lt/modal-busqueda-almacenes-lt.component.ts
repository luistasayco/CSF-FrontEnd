//libreria
import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { map } from 'rxjs/operators';
import { GlobalsConstantsForm } from '../../../../../constants/globals-constants-form';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
// const
import { ConstantesGenerales } from '../../../../../constants/Constantes-generales';

//services
import { AlmacenLtService } from '../../services/almacen-lt.service';

import { LanguageService } from '../../../../../services/language.service';
import { UtilService } from '../../../../../services/util.service';
import { StoreFeatureModule } from '@ngrx/store';

@Component({
  selector: 'app-modal-busqueda-almacenes-lt',
  templateUrl: './modal-busqueda-almacenes-lt.component.html',
  styleUrls: ['./modal-busqueda-almacenes-lt.component.css']
})

export class ModalBusquedaAlmacenLtComponent implements OnInit {


  @Input() isDisplayBusqueda = false;
  @Output() eventoRegistroSeleccionado = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<any>();
  
  
  seleccionArticulo: any;
  rowListaAlmacen: any[] = [];//rowListaArticulo
  cols: any;
  loadingTipoArticulo = true;
  loadingArticulo = false;
  
  timeAnimationModal = ConstantesGenerales.DURACION_ANIMACION_MODAL;

  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm();

  // Formulario de Busqueda
  formularioBusquedaAl: FormGroup;
  tituloAlmacen: string;
  

  //GRILLA
  opciones: any = [];

  //Parametros
  //bodyParams : any;

  constructor(
    private readonly fb: FormBuilder,
    private almacenLtService: AlmacenLtService,
    private readonly utils: UtilService,
    private activeRoute: ActivatedRoute,
    public readonly lenguageService: LanguageService) {}

  ngOnInit(): void {
    debugger;
  

    this.buildFormRq();
    this.cabeceraTabla();
    this.getAlmacen();
    this.opcionesTabla();

  }

  cabeceraTabla() {
    this.cols = [
      { field: 'warehouseCode', header: 'Cod. Almacen' },
      { field: 'warehouseName', header: 'Des. Almacen' }
    ];
  }
  
  getAlmacen() {

    debugger;

    const formBody = this.formularioBusquedaAl.value;
    
    var almacen=formBody.almacen;
    
    this.loadingArticulo = true;

    this.almacenLtService
      .getAlmacenByName(almacen)
      .pipe(map((resp) => (this.rowListaAlmacen = resp)))
      .subscribe(
        (resp) => {
          this.loadingArticulo = false;
        },
        (error) => {
          console.log(error);
        }
      );
  }

  private buildFormRq() {
    this.formularioBusquedaAl = this.fb.group({
      almacen:''
    });
  }

  

  clickAceptar() {

    this.eventoRegistroSeleccionado.emit(this.seleccionArticulo);
    this.cancel.emit();
  }
  clickCancelar() {
    this.cancel.emit();
  }
  onToBuscar() {
    debugger;
    this.getAlmacen();
  }
  
  opcionesTabla() {
    this.opciones = [
      {
        label: 'Ver',
        icon: 'pi pi-eye',
        command: () => {
          //this.ver();
        },
      }
    ];
  }



}
