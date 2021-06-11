//libreria
import { Component,Input,Output, EventEmitter,OnInit, OnDestroy } from '@angular/core';
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
import { AtencionSolicitudTrasladoService } from '../../../services/atencion-solicitud-traslado.service';
import { AlmacenService } from '../../../services/almacen.service';

//Interface
import { IMensajeResultadoApi } from '../../../../modulo-compartido/Requerimiento/interfaces/mensajeRespuestaApi.interface';
import { debug, Console } from 'console';

@Component({
  selector: 'app-atencion-solicitud-transferencia-crear',
  templateUrl: './atencion-solicitud-transferencia-crear.component.html',
  styleUrls: ['./atencion-solicitud-transferencia-crear.component.css']
})

export class AtensionSolicitudTransferenciaCrearComponent implements OnInit, OnDestroy {
  formularioSuperior: FormGroup; //jc
  // Suscripcion [para realizar el unsuscription al cerrar el formulario]
  subscription$: Subscription;
    
  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm();
 
  @Input() itemSelect:any;
  @Output() cancel = new EventEmitter<any>();
  
  //variables
  codAlmacenDestino:string ='';
  //Socio Negocio Direcciones
  rowSocioNegocioDireccion: SelectItem[];
  selectSocioNegocioDireccion: any;

  //Socio Negocio Contactos
  rowSocioNegocioContacto: SelectItem[];
  selectSocioNegocioContacto: any;
  
  // tipo de movimiento
  rowTipoMovimiento: SelectItem[];
  tipoMovimientoSelect:any;

  //GRILLA LISTA DE ARTICULOS
  listArticulosItem: any = [];
  indiceItemElegidoGrilla: any;
  opciones: any = [];
  idResaltar: number;

  //modal socio de negocio
  isActivateBusquedaSocioNegocio: boolean = false;
  //modal articulo stock
  isActivateBusquedaArticuloStock: boolean = false;
  columnas: any[];
  

  bodyParams: any;//JC
  //isActivateBusquedaArticulo = false; //jc
  loading = true; //jc
  constructor(
    private readonly fb: FormBuilder,
    private readonly activeRoute: ActivatedRoute,
    public lenguageService: LanguageService,
    public mensajePrimeNgService: MensajePrimeNgService,
    public atencionSolicitudTrasladoService: AtencionSolicitudTrasladoService,
    public userContextService: UserContextService,
    private readonly location: Location,
    private readonly almacenService: AlmacenService,//jc
    private readonly sessionStorage: SessionService,
    
    private readonly utilService: UtilService) { }

  ngOnInit(): void {
   
    console.log("crear this.itemSelect");
    console.log(this.itemSelect);

    this.buildFormSuperior();
    this.onTableColumna();
    this.opcionesTabla();
    this.listarGrilla();
    this.rowTipoMovimiento=[];
    this.rowTipoMovimiento.push({"value":1,"label":"DESCARGO POR TRANSFERENCIA"});
    this.tipoMovimientoSelect = this.rowTipoMovimiento[0];
    
    this.BPDireccionesContactos();
    
  }

  onTableColumna(){

    this.columnas = [
      { header: 'Opciones' },
      { header: 'Cod Articulo' },
      { header: 'Des Articulo' },
      { header: 'Almacen Origen' },
      { header: 'Almacen Destino' },
      { header: 'Cantidad' },
      { header: 'Codigo Unidad' },
    ];
  }

  ngOnDestroy() {
    
  }

private buildFormSuperior() {

  this.formularioSuperior = this.fb.group({
    fechaRegistro: [new Date()],
    desSocioNegocio: this.itemSelect.codSocioNegocio +" "+this.itemSelect.nombreSocioNegocio,
    observacion: this.itemSelect.observacion,
    almacenOrigen: this.itemSelect.almacenOrigen.warehouseCode + " "+this.itemSelect.almacenOrigen.warehouseName,
    almacenDestino: this.itemSelect.almacenDestino.warehouseCode + " "+this.itemSelect.almacenDestino.warehouseName,
    numsolicitud: this.itemSelect.idSolicitudTraslado,
    cbpersonal:'',
    cbdestino:'',
    cbtipomoviento:'',
    responsable: this.userContextService.getNombreCompletoUsuario(),
    estado:'POR ATENDER'
  });
}

BPDireccionesContactos(){

  //añadimos el contacto que se grabo en la bd
  
  this.atencionSolicitudTrasladoService
  .getSocioNegocioDirecciones(this.itemSelect.codSocioNegocio)
  .pipe(
    map((resp) => {
      debugger;
      
      //añadimos la direccion que se grabo en la bd
      this.rowSocioNegocioDireccion=[];
      if(this.itemSelect.destino!="") {
        this.rowSocioNegocioDireccion.push({ value:1,label:this.itemSelect.destino});
        this.selectSocioNegocioDireccion=this.rowSocioNegocioDireccion[0];
      }

      resp[0].bpAddresses.forEach(element => {
        var option={value:1,label:element.country+" - "+element.city +" - "+ element.street};
        this.rowSocioNegocioDireccion.push(option);
      });
     

      //añadimos la direccion que se grabo en la bd
      this.rowSocioNegocioContacto=[];
      if(this.itemSelect.contacto!="") {
        this.rowSocioNegocioContacto.push({ value:1,label:this.itemSelect.contacto});
        this.selectSocioNegocioContacto=this.rowSocioNegocioContacto[0];
      }
      resp[0].contactEmployees.forEach(item => {
        this.rowSocioNegocioContacto.push({value:item.name,label:item.name});
      });

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


 

  opcionesTabla() {

    this.opciones = [
      {
        label: 'Ver',
        icon: 'pi pi-eye',
        command: () => {
          //this.ver();
        },
      },
    ];  

    if(this.itemSelect.idAtencionSolicitudTransferencia==undefined){

        var objQuitar = {
          label: 'Quitar', 
          icon: 'pi pi-trash',
          command: () => {
              console.log("anular");
              this.quitar();
          },}

          this.opciones.push(objQuitar);
    }    
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
      numsolicitud,
      desSocioNegocio,
      cbpersonal,
      cbdestino,
      cbtipomoviento,
      almacenOrigen,
      almacenDestino,
      observacion
    } = this.formularioSuperior.value;
    

    if(desSocioNegocio=="" || this.itemSelect.codSocioNegocio==""){
      this.mensajePrimeNgService.onToErrorMsg(null, "SELECCIONE UN SOCIO DE NEGOCIO")
      return;
    }

    if(cbdestino == undefined || cbdestino==""){
      this.mensajePrimeNgService.onToErrorMsg(null, "SELECCIONE UN DESTINO")
      return;
    }
    

    if(almacenOrigen=="" || this.itemSelect.codAlmacenOrigen==""){
       this.mensajePrimeNgService.onToErrorMsg(null, "SELECCIONE EL ALMACEN ORIGEN")
       return;
     }

     if(almacenDestino=="" || this.itemSelect.codAlmacenDestino==""){
      this.mensajePrimeNgService.onToErrorMsg(null, "SELECCIONE EL ALMACEN DESTINO")
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

    var personalContacto= (cbpersonal==undefined)? "":cbpersonal.label;
    
    var destino= (cbdestino==undefined)? "":cbdestino.label;
    var idref = this.itemSelect.idSolicitudTraslado;

    

    var value={
      IdSolicitudTraslado:idref,
      CodSocioNegocio:this.itemSelect.codSocioNegocio,
      NombreSocioNegocio: this.itemSelect.nombreSocioNegocio,//desSocioNegocio,
      Contacto: personalContacto,
      Destino:destino,
      RegCreateIdUsuario:this.userContextService.getIdUsuario(),
      CodAlmacenOrigen: this.itemSelect.codAlmacenOrigen,
      DesAlmacenOrigen:this.itemSelect.almacenOrigen.warehouseName,
      CodAlmacenDestino:this.itemSelect.codAlmacenDestino,
      DesAlmacenDestino:this.itemSelect.almacenDestino.warehouseName,
      Observacion:observacion,
      Interno:"SI",
      IdAtencionSolicitudTransferenciaTipoMovimiento:cbtipomoviento.value,
      AtencionSolicitudTransferenciaItem:this.listArticulosItem
    }
    
    this.atencionSolicitudTrasladoService.setAtencionSolicitudTrasladoRegistrar(value).subscribe(
      (result: IMensajeResultadoApi) =>{
        this.sessionStorage.setItemEncrypt('idatencionsolicitudtraslado', result["idRegistro"]);
        this.mensajePrimeNgService.onToExitoMsg(null, result["resultadoDescripcion"]);

        setTimeout(() => {
          this.clickCancelar();
        }, 1500);
      },
      
      (error) => this.mensajePrimeNgService.onToErrorMsg(null, error.error)

    );

    
    
    
  }

  listarGrilla(){

    if(this.itemSelect.idAtencionSolicitudTransferencia== undefined){

        this.atencionSolicitudTrasladoService
        .getSolicitudTrasladoDetalle(this.itemSelect.idSolicitudTraslado)
        .pipe(
          map((resp) => {
            this.listArticulosItem=resp;
            console.log("listArticulosItem");
            console.log(this.listArticulosItem);
          })
        )
        .subscribe(
          (resp) => {
            this.loading = false;
          },
          (error) => {
            console.log(error);
          }
        );
  }else{

        debugger;

        this.formularioSuperior.patchValue({
          estado: "ATENDIDO",
        });
             
        this.atencionSolicitudTrasladoService
        .getAtencionSolicitudTrasladoDetalle(this.itemSelect.idAtencionSolicitudTransferencia)
        .pipe(
          map((resp) => {
            
            this.listArticulosItem=resp;
              debugger;
              
            //if(this.itemSelect.idAtencionSolicitudTransferencia>0 && this.itemSelect.desAtencionSolicitudTransferenciaEstado!="ANULADO"){
            // if(this.itemSelect.idAtencionSolicitudTransferencia>0 && this.itemSelect.desAtencionSolicitudTransferenciaEstado!="ANULADO"){
            //     document.getElementById("save").remove();
            // }

            if(this.itemSelect.generarNuevo=="NO"|| this.itemSelect.generarNuevo=="" || this.itemSelect.generarNuevo==undefined){
              document.getElementById("save").remove();
            }

            

          })
        )
        .subscribe(
          (resp) => {
            this.loading = false;
          },
          (error) => {
            console.log(error);
          }
        );
    }

  }

  onToBuscarSocio(){
    this.activarModalSocioNegocio();
  }

  socioNegocioSeleccionado(event: any) {
    
    this.formularioSuperior.patchValue({
      codSocioNegocio: event.cardCode,
      desSocioNegocio: event.cardName
    });

    this.activarModalSocioNegocio();
  }

  activarModalSocioNegocio() {
    this.isActivateBusquedaSocioNegocio = !this.isActivateBusquedaSocioNegocio;
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
      if (!el.cantidad) {
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

 

  clickCancelar(){
    this.cancel.emit();
  }

}
