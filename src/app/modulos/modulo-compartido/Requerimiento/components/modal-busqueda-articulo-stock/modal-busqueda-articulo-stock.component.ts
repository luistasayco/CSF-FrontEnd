//libreria
import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { map } from 'rxjs/operators';
import { GlobalsConstantsForm } from '../../../../../constants/globals-constants-form';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SelectItem } from 'primeng';
import { ActivatedRoute } from '@angular/router';
// const
import { ConstantesGenerales } from '../../../../../constants/Constantes-generales';

//interfaces
//import { IArticulo } from '../../../../modulo-requerimiento/models/requerimiento-item-bus.interface';
import { IRequerimientoItemBus } from '../../interfaces/requerimiento-item-bus.interface';

//services
//import { RequerimientoCompartidoService } from '../../services/requerimiento-compartido.service';
import { SolicitudTrasladoService } from '../../../../modulo-solicitud-traslado/services/solicitud-traslado.service';

import { LanguageService } from '../../../../../services/language.service';
import { UtilService } from '../../../../../services/util.service';
import { StoreFeatureModule } from '@ngrx/store';
//OnChanges
@Component({
  selector: 'app-modal-busqueda-articulo-stock',
  templateUrl: './modal-busqueda-articulo-stock.component.html',
  styleUrls: ['./modal-busqueda-articulo-stock.component.css']
})

export class ModalBusquedaArticuloStockComponent implements OnInit {


  @Input() isDisplayBusquedaArticulo = false;
  @Input() almacenSelect:any;
  @Output() articuloSeleccionado = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<any>();

  //@Input() selectionMode:string = 'multiple';
  @Input() tipoArticulo: number = 0;
  

  //@Input() numRq: number = 0;
  //@Input() isInventariable: boolean = false;

  rowListaArticulo: any[] = [];
  seleccionArticulo: any;


  cols: any;
  loadingTipoArticulo = true;
  loadingArticulo = false;
  
  timeAnimationModal = ConstantesGenerales.DURACION_ANIMACION_MODAL;

  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm();

  // Formulario de Busqueda
  formularioBusquedaAr: FormGroup;
  tituloAlmacen: string;
    //CB ALMACEN
  rowTipoArticulo: SelectItem[];
  seleccionTipoArticulo: any;
  //GRILLA
  opciones: any = [];

  //Parametros
  //bodyParams : any;

  constructor(
    private readonly fb: FormBuilder,
    private solicitudTrasladoService: SolicitudTrasladoService,
    private readonly utils: UtilService,
    private activeRoute: ActivatedRoute,
    public readonly lenguageService: LanguageService) {}

  ngOnInit(): void {
    debugger;

    console.log("this.almacenSelect");
    console.log(this.almacenSelect);
    console.log("tipoArticulo");
    console.log(this.tipoArticulo);
    

    this.buildFormRq();
    this.cabeceraTabla();
    //this.getArticulos();
    this.opcionesTabla();
    this.datosTipoArticulo();

    debugger;
    console.log("this.almacenSelect");
    console.log(this.almacenSelect);

    this.tituloAlmacen="ALMACEN CENTRAL";

    debugger;

  
    // this.activeRoute.queryParamMap
    // .pipe(
    //   map((params) => {
    //     this.bodyParams = {
    //       codAlmacen: params.get('codAlmacen'),
    //       desAlmacen: params.get('desAlmacen')
    //     };
        
    //     this.tituloAlmacen=this.bodyParams.desAlmacen;
    //     // this.formularioBusqueda.patchValue({
    //     //   centroCosto: this.bodyParams.desCentroCosto,
    //     // });
    //   })
    // )
    // .subscribe();


  }

  // ngOnChanges() {
  //   // if (this.isDisplayBusquedaArticulo) {
      
  //   // }
  // }

  cabeceraTabla() {
    this.cols = [
      { field: 'itemCode', header: 'Cod. Articulo' },
      { field: 'itemName', header: 'Des. Articulo' },
      { field: 'stock', header: 'Stock' }
    ];
  }
  //numRq
  getArticulos() {
debugger;

    const formBody = this.formularioBusquedaAr.value;
    const cbtipoArticulo = formBody.cbtipoArticulo;
    var idtipoArticulo=cbtipoArticulo.value;
    var nomArt=formBody.nomArticulo;
    
    this.loadingArticulo = true;
    //seleccionArticulo
    //.pipe(map((resp) => (this.rowListaArticulo = resp)))
    this.solicitudTrasladoService
      .getArticuloStock(idtipoArticulo,this.almacenSelect.value,nomArt)
      .pipe(map((resp) => (this.rowListaArticulo = resp)))
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
    this.formularioBusquedaAr = this.fb.group({
      cbtipoArticulo:'',
      nomArticulo:''
    });
  }

  

  clickAceptar() {

    this.articuloSeleccionado.emit(this.seleccionArticulo);

  }
  clickCancelar() {
    this.cancel.emit();
  }
  onToBuscar() {
    debugger;
    this.getArticulos();
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

  datosTipoArticulo() {
    this.solicitudTrasladoService
      .getTipoArticulo()
      .pipe(
        map((resp) => {
          this.rowTipoArticulo=[];
          for (let item of resp) {
            this.rowTipoArticulo.push({ label: item.groupName, value: item.number }); 
          }

          if(this.rowTipoArticulo.length>0) {

            this.seleccionTipoArticulo=this.rowTipoArticulo[0];

            console.log("this.seleccionTipoArticulo");
            console.log(this.seleccionTipoArticulo);
          }
          
        })
      )
      .subscribe(
        (resp) => {
          //this.loading = false;
        },
        (error) => {
          console.log(error);
        }
      );
          
  }

}
