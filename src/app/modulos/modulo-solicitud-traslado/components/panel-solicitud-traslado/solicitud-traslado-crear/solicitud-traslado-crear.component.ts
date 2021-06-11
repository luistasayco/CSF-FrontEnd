//libreria
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
//import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';//JC
import { Location } from '@angular/common';
import { map } from 'rxjs/operators';//JC
import { SelectItem } from 'primeng';
//constante
import { GlobalsConstantsForm } from '../../../../../constants/globals-constants-form';

//services
import { SessionService } from '../../../../../services/session.service';
import { LanguageService } from '../../../../../services/language.service';
import { MensajePrimeNgService } from '../../../../../services/mensaje-prime-ng.service';
import { UserContextService } from '../../../../../services/user-context.service';
import { UtilService } from '../../../../../services/util.service';
import { SolicitudTrasladoService } from '../../../services/solicitud-traslado.service';
import { AlmacenService } from '../../../services/almacen.service';

//Interface
import { IMensajeResultadoApi } from '../../../../modulo-compartido/Requerimiento/interfaces/mensajeRespuestaApi.interface';
import { debug } from 'console';

@Component({
  selector: 'app-solicitud-traslado-crear',
  templateUrl: './solicitud-traslado-crear.component.html',
  styleUrls: ['./solicitud-traslado-crear.component.css']
})

export class SolicitudTrasladoCrearComponent implements OnInit, OnDestroy {
  formularioSuperior: FormGroup; //jc
  // Suscripcion [para realizar el unsuscription al cerrar el formulario]
  subscription$: Subscription;
  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm();
 
  //variables
  inputAlmacen: string="";
  codAlmacenOrigen:string="";
  codAlmacenDestino:string="";
  
  //CB ALMACEN
  rowAlmacen: SelectItem[];
  almacenOrigenSelect:any;

  rowMotivo: SelectItem[];


  //GRILLA LISTA DE ARTICULOS
  listArticulosItem: any = [];
  indiceItemElegidoGrilla: any;
  opciones: any = [];


  //modal socio de negocio
  isActivateBusquedaSocioNegocio: boolean = false;
  //modal articulo stock
  isActivateBusquedaArticuloStock: boolean = false;

  //modal almacen
  isActivateBusquedaAlmacen: boolean = false;


  bodyParams: any;//JC
  //isActivateBusquedaArticulo = false; //jc
  loading = true; //jc
  constructor(
    private readonly fb: FormBuilder,
    private readonly activeRoute: ActivatedRoute,
    public lenguageService: LanguageService,
    public mensajePrimeNgService: MensajePrimeNgService,
    public solicitudTrasladoService: SolicitudTrasladoService,
    public userContextService: UserContextService,
    private readonly location: Location,
    private readonly almacenService: AlmacenService,//jc
    private readonly sessionStorage: SessionService,
    
    private readonly utilService: UtilService) { }

  ngOnInit(): void {
    debugger;

    this.buildFormSuperior();
    this.obtenerParametrosDeRuta();
    this.opcionesTabla();
    //this.datosAlmacen();

    this.rowMotivo=[];
    this.rowMotivo.push({"value":1,"label":"NORMAL"},{"value":2,"label":"URGENTE"});

  }

  ngOnDestroy() {
    
  }

  // datosAlmacen() {
  //   this.almacenService
  //     .getAlmacen()
  //     .pipe(
  //       map((resp) => {
  //         this.rowAlmacen=[];
  //         for (let item of resp) {
  //           this.rowAlmacen.push({ label: item.warehouseName, value: item.warehouseCode }); 
  //         }

  //         this.almacenOrigenSelect=  this.rowAlmacen[0];

  //       })
  //     )
  //     .subscribe(
  //       (resp) => {
  //         this.loading = false;
  //       },
  //       (error) => {
  //         console.log(error);
  //       }
  //     );
          
  // }

private buildFormSuperior() {
  this.formularioSuperior = this.fb.group({
    fechaReg: [new Date()],
    codSocioNegocio:'',
    desSocioNegocio:'',
    observacion:'',
    // cbAlmacenOrigen:'',
    // cbAlmacenDestino:'',
    cbMotivo:'',
    almacenOrigen:'',
    almacenDestino:'',
    responsable: this.userContextService.getNombreCompletoUsuario(),
    estado:'ABIERTO'
  });
}

obtenerParametrosDeRuta() {
  this.activeRoute.queryParamMap
  .pipe(
    map((params) => {
      this.bodyParams = {
        idUsuario: Number(params.get('idUsuario')),
        codCentroCosto: params.get('codCentroCosto'),
        desCentroCosto: params.get('desCentroCosto'),        
      };
      this.formularioSuperior.patchValue({
        observacionValeSalida: this.bodyParams.codCentroCosto,
      });
    })
  )
  .subscribe();
}

articuloBuscado(event: any[]) {
    debugger;
    this.cambioDeEstructuraDeArticulo_AddFechaNecesaria(event);
    this.activarModalArticuloStock();
    
  }
  
  cambioDeEstructuraDeArticulo_AddFechaNecesaria(event: any[]) {

  debugger;

  for (const item of event) {
            var newRq = {
              codArticulo:item.itemCode,
              desArticulo: item.itemName,
              codUnidadMedida: item.salesUnit,
              desUnidadMedida: item.salesUnit,
              cantidad: parseFloat(item.stock.toFixed(2))
            }
          this.listArticulosItem.push(newRq);
          }

          
  }

  opcionesTabla() {
    this.opciones = [
      {
        label: 'Ver',
        icon: 'pi pi-eye',
        command: () => {
          //this.ver();
        },
      },
      {
        label: 'Quitar',
        icon: 'pi pi-trash',
        command: () => {
            console.log("anular");
            this.quitar();
        },
      },
    ];
  }
 
  quitar() {
    this.listArticulosItem.splice(+this.indiceItemElegidoGrilla, 1);
  }

  itemElegido(item) {
    this.indiceItemElegidoGrilla = item;
  }
  
  onClickRegresar() {
    this.location.back();
  }

  clickGuardar(){

    debugger;

    const {
      codSocioNegocio,
      desSocioNegocio,
      // cbAlmacenOrigen,
      // cbAlmacenDestino,
      cbMotivo,
      observacion
    } = this.formularioSuperior.value;
    

    if(codSocioNegocio==""){
      this.mensajePrimeNgService.onToErrorMsg(null, "SELECCIONE UN SOCIO DE NEGOCIO")
      return;
    }

    if(this.codAlmacenOrigen==""){
       this.mensajePrimeNgService.onToErrorMsg(null, "SELECCIONE EL ALMACEN ORIGEN")
       return;
     }

     if(this.codAlmacenDestino==""){
      this.mensajePrimeNgService.onToErrorMsg(null, "SELECCIONE EL ALMACEN DESTINO")
      return;
    }

    if(this.codAlmacenOrigen ==this.codAlmacenDestino){
      this.mensajePrimeNgService.onToErrorMsg(null, "SELECCIONE EL ALMACEN DIFERENTES")
      return;
    }


    if(cbMotivo==""){
      this.mensajePrimeNgService.onToErrorMsg(null, "SELECCIONE UN MOTIVO POR FAVOR")
      return;
    }

     if(this.listArticulosItem.length==0){
       this.mensajePrimeNgService.onToErrorMsg(null, "NO HAY DATOS EN LA GRILLA")
       return;
     }

     // VALIDACION DEL DETALLE.
    if (!this.validarCantidadGrilla(this.listArticulosItem)) {
      return;
    }



    var value={
      CodSocioNegocio:codSocioNegocio,
      NombreSocioNegocio:desSocioNegocio,
      RegCreateIdUsuario:this.userContextService.getIdUsuario(),
      CodAlmacenOrigen:this.codAlmacenOrigen,//cbAlmacenOrigen.value,
      CodAlmacenDestino:this.codAlmacenDestino,//cbAlmacenDestino.value,
      Observacion:observacion,
      IdMotivoSolicitudTraslado:cbMotivo.value,
      SolicitudTrasladoItem:this.listArticulosItem
    }
    
    this.solicitudTrasladoService.setSolicitudTrasladoRegistrar(value).subscribe(
      (result: IMensajeResultadoApi) =>{
        this.sessionStorage.setItemEncrypt('idsolicitudtraslado', result["idRegistro"]);
        this.mensajePrimeNgService.onToExitoMsg(null, result["resultadoDescripcion"]);
        setTimeout(() => {
          this.onClickRegresar();
        }, 1500);
      },
      
      (error) => this.mensajePrimeNgService.onToErrorMsg(null, error.error)

    );

    document.getElementById("btnsave").remove();
    
    
  }

  onToBuscarSocio(){

    this.activarModalSocioNegocio();

  }

  onToBuscarArticulo(){
    debugger;
    this.activarModalArticuloStock();

  }

  almacenSeleccionado(event: any) {
   
    if(this.inputAlmacen=="origen"){
        this.codAlmacenOrigen = event.warehouseCode;
        this.formularioSuperior.patchValue({
          almacenOrigen: event.warehouseCode+" "+event.warehouseName
        });
    }
      else{
          this.codAlmacenDestino = event.warehouseCode;
          this.formularioSuperior.patchValue({
            almacenDestino: event.warehouseCode+" "+event.warehouseName
          });
      }
   
  }

  socioNegocioSeleccionado(event: any) {
    debugger;
    this.formularioSuperior.patchValue({
      codSocioNegocio: event.cardCode,
      desSocioNegocio: event.cardName
    });

    this.activarModalSocioNegocio();
  }

  activarModalSocioNegocio() {
    this.isActivateBusquedaSocioNegocio = !this.isActivateBusquedaSocioNegocio;
  }

  activarModalAlmacen(input="") {
    debugger;
    this.inputAlmacen=input;
    this.isActivateBusquedaAlmacen = !this.isActivateBusquedaAlmacen;
  }

  activarModalArticuloStock() {
    debugger;
    
       const {
        almacenOrigen
    } = this.formularioSuperior.value;

    //this.almacenOrigenSelect =this.formularioSuperior.value.cbAlmacenOrigen;
    this.almacenOrigenSelect = {label:almacenOrigen,value:this.codAlmacenOrigen};

    if(this.codAlmacenOrigen==""){
      this.mensajePrimeNgService.onToErrorMsg(null, "SELECCIONE EL ALMACEN ORIGEN");

    }

    else{
      this.isActivateBusquedaArticuloStock = !this.isActivateBusquedaArticuloStock;
    }

    
    
  }

  fechas_DDMMAAAA(fecha: string | Date): string {
    let dia =new Date(fecha).getDate();
    let mes =new Date(fecha).getMonth()+1;
    const day = (dia<9)? "0"+dia:dia;
    const month =(mes<9)? "0"+mes:mes;
    const year = new Date(fecha).getFullYear();
    const fechaFinal = `${year}-${month}-${day}`;
    
    return fechaFinal;
  }

  validarCantidadGrilla(data: any[]) {

    let mensaje: string = '';
    let validado = true;

    data.forEach((el) => {
      debugger
      if (el.cantidad==0) {
        validado = false;
        mensaje += `La cantidad no es válida para el artículo ${el.codArticulo}`
      }      
    });

    if (!validado) {
      mensaje = `${mensaje}`;
      this.mensajePrimeNgService.onToInfoMsg(null, mensaje);
    }

    return validado;
  }

}
