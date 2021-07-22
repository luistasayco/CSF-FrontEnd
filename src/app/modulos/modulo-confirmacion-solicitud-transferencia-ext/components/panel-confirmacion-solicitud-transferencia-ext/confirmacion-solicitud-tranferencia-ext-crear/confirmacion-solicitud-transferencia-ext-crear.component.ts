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
import { ConfirmacionSolicitudTrasladoService } from '../../../services/confirmacion-solicitud-traslado.service';
import { AlmacenService } from '../../../services/almacen.service';

//Interface
import { IMensajeResultadoApi } from '../../../../modulo-compartido/Requerimiento/interfaces/mensajeRespuestaApi.interface';

@Component({
  selector: 'app-confirmacion-solicitud-transferencia-ext-crear',
  templateUrl: './confirmacion-solicitud-transferencia-ext-crear.component.html',
  styleUrls: ['./confirmacion-solicitud-transferencia-ext-crear.component.css']
})

export class ConfirmacionSolicitudTransferenciaExtCrearComponent implements OnInit, OnDestroy {
  formularioSuperior: FormGroup; //jc
  // Suscripcion [para realizar el unsuscription al cerrar el formulario]
  subscription$: Subscription;
    
  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm();
  timeAnimationModal = ConstantesGenerales.DURACION_ANIMACION_MODAL;

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
  
   // tipo de documento
   rowTipoDocumento: SelectItem[];
   tipoDocumentoSelect:any;

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
    public confirmacionSolicitudTrasladoService: ConfirmacionSolicitudTrasladoService,
    public userContextService: UserContextService,
    private readonly location: Location,
    private readonly almacenService: AlmacenService,//jc
    private readonly sessionStorage: SessionService,
    private messageService: MessageService,
    private readonly utilService: UtilService) { }

  ngOnInit(): void {



    this.buildFormSuperior();
    this.opcionesTabla();
    this.listarGrilla();
    this.rowTipoMovimiento=[];
    this.rowTipoMovimiento.push({"value":1,"label":"DESCARGO POR TRANSFERENCIA"});
    this.tipoMovimientoSelect = this.rowTipoMovimiento[0];
    this.BPDireccionesContactos();
    this.selectGuia();

  }

  ngOnDestroy() {
    
  }

private buildFormSuperior() {

  this.formularioSuperior = this.fb.group({
    fechaRegistro: [new Date()],
    desSocioNegocio: this.itemSelect.codSocioNegocio +" "+this.itemSelect.nombreSocioNegocio,
    observacion: this.itemSelect.observacion,
    almacenOrigen: this.itemSelect.desAlmacenOrigen,
    almacenDestino: this.itemSelect.desAlmacenDestino,
    numsolicitud: this.itemSelect.atencionSolicitudTransferencia.idSolicitudTraslado,
    cbpersonal:'',
    cbdestino:'',
    cbtipomoviento:'',
    cbtipodocumento:'',
    serie:this.itemSelect.serie,
    numero:this.itemSelect.numero,
    responsable: this.userContextService.getNombreCompletoUsuario(),
    estado:'CONFIRMADO'
  });
}

BPDireccionesContactos(){

    //añadimos la direccion que se grabo en la bd
    this.rowSocioNegocioDireccion=[];
    if(this.itemSelect.destino!="") {
      this.rowSocioNegocioDireccion.push({ value:1,label:this.itemSelect.destino});
      this.selectSocioNegocioDireccion=this.rowSocioNegocioDireccion[0];
    }

     //añadimos la direccion que se grabo en la bd
     this.rowSocioNegocioContacto=[];
     if(this.itemSelect.contacto!="") {
       this.rowSocioNegocioContacto.push({ value:this.itemSelect.codigoInternoContacto,label:this.itemSelect.contacto});
       this.selectSocioNegocioContacto=this.rowSocioNegocioContacto[0];
     }


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

    if(this.itemSelect.idConfirmacionSolicitudTransferencia==undefined){

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
    //   this.messageService.add({key: 'confirmacionExtCrear', severity:'error', summary: 'Mensaje', detail: `SELECCIONE UN SOCIO DE NEGOCIO`});
    //   return;
    // }

    // if(cbdestino == undefined || cbdestino==""){
    //   this.messageService.add({key: 'confirmacionExtCrear', severity:'error', summary: 'Mensaje', detail: `SELECCIONE UN DESTINO`});
    //   return;
    // }
    

    if(almacenOrigen=="" || this.itemSelect.codAlmacenOrigen==""){
       this.messageService.add({key: 'confirmacionExtCrear', severity:'error', summary: 'Mensaje', detail: `SELECCIONE EL ALMACEN ORIGEN`});
       return;
     }

     if(almacenDestino=="" || this.itemSelect.codAlmacenDestino==""){
      this.messageService.add({key: 'confirmacionExtCrear', severity:'error', summary: 'Mensaje', detail: `SELECCIONE EL ALMACEN DESTINO`});
      return;
    }

    if(this.itemSelect.codDocumento==""){
      this.messageService.add({key: 'confirmacionExtCrear', severity:'error', summary: 'Mensaje', detail: `SELECCIONE EL TIPO DE DOCUMENTO`});
      return;
    }

     if(this.listArticulosItem.length==0){
       this.messageService.add({key: 'confirmacionExtCrear', severity:'error', summary: 'Mensaje', detail: `NO HAY DATOS EN LA GRILLA`});
       return;
     }

     // VALIDACION DEL DETALLE.
    if (!this.validarCantidadGrilla(this.listArticulosItem)) {
      return;
    }

    this.itemSelect.codSocioNegocio = (this.itemSelect.codSocioNegocio=="")? null:this.itemSelect.codSocioNegocio;
    this.itemSelect.nombreSocioNegocio = (this.itemSelect.nombreSocioNegocio=="")? null:this.itemSelect.nombreSocioNegocio;

    var personalContacto= (cbpersonal==undefined)? null:cbpersonal.label;
    var codPersonalContacto= (cbpersonal==undefined)? null:parseInt(cbpersonal.value);

    var destino= (cbdestino==undefined)? null:cbdestino.label;
    var idref = this.itemSelect.atencionSolicitudTransferencia.idSolicitudTraslado;

    var value={
      IdAtencionSolicitudTransferencia:this.itemSelect.idAtencionSolicitudTransferencia,
      AtencionSolicitudTransferencia:{IdSolicitudTraslado:idref},
      CodSocioNegocio:this.itemSelect.codSocioNegocio,
      NombreSocioNegocio: this.itemSelect.nombreSocioNegocio,
      CodigoInternoContacto:codPersonalContacto,
      Contacto: personalContacto,
      Destino:destino,
      RegCreateIdUsuario:this.userContextService.getIdUsuario(),
      CodAlmacenOrigen: this.itemSelect.codAlmacenOrigen,
      DesAlmacenOrigen:this.itemSelect.desAlmacenOrigen,
      CodAlmacenDestino:this.itemSelect.codAlmacenDestino,
      DesAlmacenDestino:this.itemSelect.desAlmacenDestino,
      Observacion:observacion,
      Interno:"NO",
      CodDocumento:this.itemSelect.codDocumento,
      Documento:this.itemSelect.documento,
      Serie:this.itemSelect.serie,
      Numero:this.itemSelect.numero,
      IdConfirmacionSolicitudTransferenciaTipoMovimiento:cbtipomoviento.value,
      ConfirmacionSolicitudTransferenciaItem:this.listArticulosItem
    }
    
    this.confirmacionSolicitudTrasladoService.setConfirmacionSolicitudTrasladoRegistrar(value).subscribe(
      (result: IMensajeResultadoApi) =>{
        this.sessionStorage.setItemEncrypt('idconfirmacionsolicitudtraslado-ext', result["idRegistro"]);
        this.mensajePrimeNgService.onToExitoMsg(null, result["resultadoDescripcion"]);

        if(result["idRegistro"]>0){
          
          document.getElementById("save").remove();
          this.enviarSapTrasladoStock(result["idRegistro"]);
        }

      },
      
      (error) => this.mensajePrimeNgService.onToErrorMsg(null, error.error)

    );

  }

  listarGrilla(){

    debugger;
    if(this.itemSelect.idConfirmacionSolicitudTransferencia== null){
      debugger;
        this.confirmacionSolicitudTrasladoService
        .getAtencionSolicitudTrasladoDetalle(this.itemSelect.idAtencionSolicitudTransferencia)
        .pipe(
          map((resp:any) => {
            debugger;
            this.listArticulosItem=resp;
           
            this.listArticulosItem.forEach(element => {
            
              if(element.isUbicacion=="Y"){
                  element.ubicacionOrigen=element.atencionSolicitudTransferenciaItemUbicacion.find(x=>x.tipoAccionContenedor=='batFromWarehouse').binAbsEntry;
                  element.ubicacionDestino=element.atencionSolicitudTransferenciaItemUbicacion.find(x=>x.tipoAccionContenedor=='batToWarehouse').binCode;
                  element.confirmacionSolicitudTransferenciaItemUbicacion=element.atencionSolicitudTransferenciaItemUbicacion;
                }

            });

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
          estado: "CERRAR",
        });
             
        this.confirmacionSolicitudTrasladoService
        .getConfirmacionSolicitudTrasladoDetalle(this.itemSelect.idAtencionSolicitudTransferencia)
        .pipe(
          map((resp) => {
            
            this.listArticulosItem=resp;
           
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
      if (!el.cantidadEntregada) {
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

  selectGuia(){
    
    this.rowTipoDocumento=[];
     if(this.itemSelect.codDocumento!="") {
       this.rowTipoDocumento.push({ value:this.itemSelect.codDocumento,label:this.itemSelect.documento});
       this.tipoDocumentoSelect=this.rowTipoDocumento[0];
     }

  }

  ver(){

    this.isArticuloVerModal = !this.isArticuloVerModal;
    const { codArticulo,desArticulo } = this.indiceItemElegidoGrilla;
    this.tituloArticuloVerModal = `Ver Articulo - Id: ${codArticulo}`;

  }

  enviarSapTrasladoStock(id){
  debugger
    this.confirmacionSolicitudTrasladoService
      .getAllById(id)
      .pipe(
        map((resp:any) => {
          debugger;
          var value={
            CardCode: resp.codSocioNegocio,
            CardName: resp.nombreSocioNegocio,
            ContactPerson:resp.codigoInternoContacto,
            JournalMemo: resp.observacion,
            FromWarehouse: resp.codAlmacenOrigen,
            ToWarehouse: resp.codAlmacenDestino,
            U_SYP_MDTS: "TSE",
            U_SYP_MDMT: "11", 
            U_SYP_MDTD: resp.codDocumento,
            U_SYP_MDSD: resp.serie,
            U_SYP_MDCD: resp.numero,
            StockTransferLines:[]
          }
          
          resp.confirmacionSolicitudTransferenciaItem.forEach((item) => {

            var itemLinea ={
              LineNum: item.numLinea,
              ItemCode: item.codArticulo,
              ItemDescription: item.desArticulo,
              Quantity: item.cantidadEntregada,
              FromWarehouseCode: resp.codAlmacenOrigen,
              WarehouseCode: resp.codAlmacenDestino,
              ProjectCode: "",
              BaseType:"InventoryTransferRequest",
              BaseLine: item.numLinea,
              BaseEntry: resp.atencionSolicitudTransferencia.docEntry,
              BatchNumbers:[],
              StockTransferLinesBinAllocations:[]
            }

            item.confirmacionSolicitudTransferenciaItemLote.forEach((itemLote) => {

              var batchNumber={
                BatchNumber: itemLote.numLote,
                Quantity: itemLote.cantidadEntregada,
                BaseLineNumber:item.numLinea,
                ItemCode:item.codArticulo
              }
              
              itemLinea.BatchNumbers.push(batchNumber);

            });
            debugger
            item.confirmacionSolicitudTransferenciaItemUbicacion.forEach((itemUb) => {
              debugger
              var ubicacion={
                BinAbsEntry: itemUb.binAbsEntry,
                Quantity: itemUb.cantidad,
                AllowNegativeQuantity:itemUb.permitirCantidaNegativa,
                BinActionType:itemUb.tipoAccionContenedor,
                BaseLineNumber:item.numLinea
              }
              
              itemLinea.StockTransferLinesBinAllocations.push(ubicacion);

            });

            value.StockTransferLines.push(itemLinea);

          });

          var send ={
            Id:resp.idConfirmacionSolicitudTransferencia,
            IdUsuario:this.userContextService.getIdUsuario(),
            value:value
          }

          this.confirmacionSolicitudTrasladoService
          .postSapTrasladoStock(send)
          .pipe(
            map((resp) => {
              
              this.clickCancelar();

              if(resp["exito"]==true){
                this.messageService.add({key: 'confirmacionExt', severity:'info', summary: 'Mensaje', detail: `SE ENVIO CORRECTAMENTE A SAP BO - DocEntry ${resp["docEntry"]}`});
              }else{
                this.messageService.add({key: 'confirmacionExt', severity:'error', summary: 'Mensaje', detail: `ERROR DE ENVIAR A SAP BO : ${resp["mensaje"]}`});
              }
              
            })
          )
          .subscribe(
            (resp) => {
              //this.loading = false;
            },
            (error) => {
              this.clickCancelar();
              this.messageService.add({key: 'confirmacionExt', severity:'error', summary: 'Mensaje', detail: ` ERROR DE ENVIAR A SAP BO EL TRASLADO E STOCK`});

            }
          );

        })
      )
      .subscribe();

  }

}
