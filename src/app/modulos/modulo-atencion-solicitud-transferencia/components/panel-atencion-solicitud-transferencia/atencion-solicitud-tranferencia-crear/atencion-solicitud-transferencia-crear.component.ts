//libreria
import { Component,Input,Output, EventEmitter,OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';//JC
import { Location } from '@angular/common';
import { map } from 'rxjs/operators';//JC
import { SelectItem } from 'primeng';
//constante
import { GlobalsConstantsForm } from '../../../../../constants/globals-constants-form';
import { ConstantesGenerales } from '../../../../../constants/Constantes-generales';

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

@Component({
  selector: 'app-atencion-solicitud-transferencia-crear',
  templateUrl: './atencion-solicitud-transferencia-crear.component.html',
  styleUrls: ['./atencion-solicitud-transferencia-crear.component.css']
})


export class AtensionSolicitudTransferenciaCrearComponent implements OnInit {
  formularioSuperior: FormGroup; //jc
  timeAnimationModal = ConstantesGenerales.DURACION_ANIMACION_MODAL;
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
  
  //modal ver articulo
  isArticuloVerModal = false;
  tituloArticuloVerModal: any;
  
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
    private messageService: MessageService,
    private readonly utilService: UtilService) { }

  ngOnInit(): void {
   
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
      { header: 'Num Linea' },
      { header: 'Código Articulo' },
      { header: 'Descripción Articulo' },
      { header: 'Almacén Origen' },
      { header: 'Almacén Destino' },
      { header: 'Cantidad Solicitada' },
      { header: 'Cantidad Atendida' },
      { header: 'Lote' },
      { header: 'Ubicación' },
      { header: 'Código Unidad' },
    ];
    
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

  if(this.itemSelect.codSocioNegocio==undefined || this.itemSelect.codSocioNegocio=="") return true;
  
  this.atencionSolicitudTrasladoService
  .getSocioNegocioDirecciones(this.itemSelect.codSocioNegocio)
  .pipe(
    map((resp) => {
      
      
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
      resp[0].contactEmployees.forEach(item => {
        
        this.rowSocioNegocioContacto.push({value:item.internalCode,label:item.name});
      });

    })
  )
  .subscribe(
    (resp) => {
      //this.loading = false;
      
    },
    (error) => {
      this.mensajePrimeNgService.onToErrorMsg(null, "error: al cargar el servicio de direcciones y contacto del socio de negocio "+error.status+" "+error.statusText)
      //console.log(error);
    }
  );

}

  opcionesTabla() {

    this.opciones = [
      {
        label: 'Ver',
        icon: 'pi pi-eye',
        command: () => {
          this.ver();
        },
      },
    ];  
    
    // 2 = ANULADO
    if(this.itemSelect.idAtencionSolicitudTransferencia==undefined || this.itemSelect.idAtencionSolicitudTransferenciaEstado==2){

        var objQuitar = {
          label: 'Quitar', 
          icon: 'pi pi-trash',
          command: () => {
              this.quitar();
          },}

          this.opciones.push(objQuitar);
    }    
  }
 
  quitar() {
    
    this.listArticulosItem.splice(this.indiceItemElegidoGrilla.numLinea, 1);

  }

  itemElegido(item) {
    
    this.indiceItemElegidoGrilla = item;
  }
  
  onClickRegresar() {
    this.location.back();
  }

  clickGuardar(){
    
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
    

    // if(desSocioNegocio=="" || this.itemSelect.codSocioNegocio==""){
    //   this.messageService.add({key: 'myKeyAtencionCrear', severity:'warn', summary: 'Mensaje', detail: `SELECCIONE UN SOCIO DE NEGOCIO`});
    //   return;
    // }    
    
    // if(cbdestino == undefined || cbdestino==""){
    //   this.messageService.add({key: 'myKeyAtencionCrear', severity:'warn', summary: 'Mensaje', detail: `SELECCIONE UN DESTINO`});
    //   return;
    // }

    if(almacenDestino=="" || this.itemSelect.codAlmacenDestino==""){
      this.messageService.add({key: 'myKeyAtencionCrear', severity:'warn', summary: 'Mensaje', detail: `SELECCIONE EL ALMACEN DESTINO`});
      return;
    }

    if(almacenOrigen=="" || this.itemSelect.codAlmacenOrigen==""){
       this.messageService.add({key: 'myKeyAtencionCrear', severity:'warn', summary: 'Mensaje', detail: `SELECCIONE EL ALMACEN ORIGEN`});
       return;
     } 

     if(this.listArticulosItem.length==0){
       this.messageService.add({key: 'myKeyAtencionCrear', severity:'warn', summary: 'Mensaje', detail: `NO HAY DATOS EN LA GRILLA`});
       return;
     }

     // VALIDACION DEL DETALLE.
    if (!this.validarCantidadGrilla(this.listArticulosItem)) {
      return;
    }

    
    this.itemSelect.codSocioNegocio = (this.itemSelect.codSocioNegocio=="")? null:this.itemSelect.codSocioNegocio;
    this.itemSelect.nombreSocioNegocio = (this.itemSelect.nombreSocioNegocio=="")? null:this.itemSelect.nombreSocioNegocio;

    var personalContacto= (cbpersonal==undefined)? null:cbpersonal.label;
    var codPersonalContacto= (cbpersonal==undefined)? null: parseInt(cbpersonal.value);
    
    var destino = (cbdestino==undefined)? "":cbdestino.label;
    var codDestino = (cbdestino==undefined)? "":cbdestino.value;
    var idref = this.itemSelect.idSolicitudTraslado;   

    var value={
      IdSolicitudTraslado:idref,
      CodSocioNegocio: this.itemSelect.codSocioNegocio,
      NombreSocioNegocio: this.itemSelect.nombreSocioNegocio,//desSocioNegocio,
      CodigoInternoContacto: codPersonalContacto,
      Contacto: personalContacto,
      CodDestino:codDestino,
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

        if(result["idRegistro"]>0){
          
          document.getElementById("btnsave").remove();
          this.envioSap(value,result["idRegistro"]);
        }

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


        this.formularioSuperior.patchValue({
          estado: "ATENDIDO",
        });
             
        this.atencionSolicitudTrasladoService
        .getAtencionSolicitudTrasladoDetalle(this.itemSelect.idAtencionSolicitudTransferencia)
        .pipe(
          map((resp) => {
            
            this.listArticulosItem=resp;
            
            if(this.itemSelect.generarNuevo=="NO"|| this.itemSelect.generarNuevo=="" || this.itemSelect.generarNuevo==undefined){
              document.getElementById("btnsave").remove();
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
      
      if (!el.cantidadAtendida) {
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

  onKeypressEvent(model: any,event: any){
    
    setTimeout(() => {
    
      if(model.cantidadAtendida>model.cantidadSolicitada){
        model.cantidadAtendida = model.cantidadSolicitada;
        this.mensajePrimeNgService.onToErrorMsg(null, "La Cantidad atendida debe ser menor o gual, que la cantidad solicitada")
        event.preventDefault();
      }

    }, 0);
    
 }
 

  clickCancelar(){
    this.cancel.emit();
  }

  ver(){

    this.isArticuloVerModal = !this.isArticuloVerModal;
    const { codArticulo,desArticulo } = this.indiceItemElegidoGrilla;
    this.tituloArticuloVerModal = `Ver Articulo - Id: ${codArticulo}`;

  }
  
  envioSap(obj,idAtencion) {
    
    var value={
      CardCode: obj.CodSocioNegocio,
      CardName: obj.NombreSocioNegocio,
      ContactPerson:obj.CodigoInternoContacto,
      Address: obj.Destino,
      JournalMemo: obj.Observacion,
      FromWarehouse: obj.CodAlmacenOrigen,
      ToWarehouse: obj.CodAlmacenDestino,
      U_SYP_MDTS: "TSI",
      StockTransferLines:[]
    }

    obj.AtencionSolicitudTransferenciaItem.forEach((item) => {
      
      var itemLinea ={
        LineNum: item.numLinea,
        ItemCode: item.codArticulo,
        ItemDescription: item.desArticulo,
        Quantity: item.cantidadAtendida,
        FromWarehouseCode: obj.CodAlmacenOrigen,
        WarehouseCode: obj.CodAlmacenDestino,
        ProjectCode: "",
      }

      value.StockTransferLines.push(itemLinea);
      
    });

    var send ={
      Id:idAtencion,
      IdUsuario:obj.RegCreateIdUsuario,
      value:value
    }

    this.atencionSolicitudTrasladoService
        .postSapSolicitudTraslado(send)
        .pipe(
          map((resp) => {
            
            this.clickCancelar();

            if(resp["exito"]==true){
              this.messageService.add({key: 'myKeyAtencion', severity:'info', summary: 'Mensaje', detail: `[SAP BO] SE ENVIO LA SOLICITUD CORRECTAMENTE`});
            }else{
              this.messageService.add({key: 'myKeyAtencion', severity:'error', summary: 'Mensaje', detail: ` ERROR DE ENVIAR A SAP BO LA SOLICITUD: ${resp["mensaje"]}`});
            }
            
          })
        )
        .subscribe(
          (resp) => {
            
          },
          (error) => {
            this.clickCancelar();
            this.messageService.add({key: 'myKeyAtencion', severity:'error', summary: 'Mensaje', detail: ` ERROR DE ENVIAR A SAP BO LA SOLICITUD: error ${error.error}`});

          }
        );
    }

}
