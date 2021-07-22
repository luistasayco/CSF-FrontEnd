//libreria
import { Component,Input,Output, EventEmitter,OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';//JC
import { Location } from '@angular/common';
import { map } from 'rxjs/operators';
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
  selector: 'app-confirmacion-solicitud-transferencia-crear',
  templateUrl: './confirmacion-solicitud-transferencia-crear.component.html',
  styleUrls: ['./confirmacion-solicitud-transferencia-crear.component.css']
})

export class ConfirmacionSolicitudTransferenciaCrearComponent implements OnInit {
  formularioSuperior: FormGroup; //jc
  // Suscripcion [para realizar el unsuscription al cerrar el formulario]
  subscription$: Subscription;
    
 

  @Input() itemSelect:any;
  @Output() cancel = new EventEmitter<any>();

  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm();
  timeAnimationModal = ConstantesGenerales.DURACION_ANIMACION_MODAL;

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
  //itemSeleccionado: any
  opciones: any = [];
  idResaltar: number;

  //modal socio de negocio
  isActivateBusquedaSocioNegocio: boolean = false;
  //modal articulo stock
  isActivateBusquedaArticuloStock: boolean = false;
  columnas: any[];
  
  //Almacen origen
  selectAlmacenOrigen: any;

  //Modal lote Cantidad
  tituloEditarCantiddaVer: string;
  isActivateCantidadEditar = false; 
  listModalRequerimientoProducto: any = [];

  //Modal ubicacion
  isActivateUbicacion = false; 
  ModalUbicacionItemCode: string="";
  ModalUbicacionWhsCode: string="";
  ModalUbicacionEntorno: string="";

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
    
  }

private buildFormSuperior() {

  this.selectAlmacenOrigen = {codAlmacenOrigen:this.itemSelect.codAlmacenOrigen,desAlmacenOrigen:this.itemSelect.desAlmacenOrigen};

  this.formularioSuperior = this.fb.group({
    fechaRegistro: [new Date()],//
    desSocioNegocio: this.itemSelect.codSocioNegocio +" "+this.itemSelect.nombreSocioNegocio,//
    observacion: this.itemSelect.observacion,//
    almacenOrigen: this.itemSelect.desAlmacenOrigen,//
    almacenDestino: this.itemSelect.desAlmacenDestino,//
    numsolicitud: this.itemSelect.atencionSolicitudTransferencia.idSolicitudTraslado,//
    cbpersonal:'',//
    cbdestino:'',//
    cbtipomoviento:'',//
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
        label: 'Lote',
        icon: 'pi pi-pencil',
        command: () => {
          this.loteCantida();
        },
      },
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

    if(item.isLote =="Y"){
      this.opciones.find(x=>x.label=="Lote").visible=true;
    }else{
      this.opciones.find(x=>x.label=="Lote").visible=false;
    }

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
    //   this.messageService.add({key: 'myKeyCrear', severity:'warn', summary: 'Mensaje', detail: `SELECCIONE UN SOCIO DE NEGOCIO`});
    //   return;
    // }    

    //  if(almacenDestino=="" || this.itemSelect.codAlmacenDestino==""){
    //   this.mensajePrimeNgService.onToErrorMsg(null, "SELECCIONE EL ALMACEN DESTINO")
    //   return;
    // }

    if(almacenOrigen=="" || this.itemSelect.codAlmacenOrigen==""){
      this.messageService.add({key: 'myKeyCrear', severity:'warn', summary: 'Mensaje', detail: `SELECCIONE EL ALMACEN ORIGEN`});
      return;
    }

     if(this.listArticulosItem.length==0){
       this.messageService.add({key: 'myKeyCrear', severity:'warn', summary: 'Mensaje', detail: `NO HAY DATOS EN LA GRILLA`});
       return;
     }
     
     // VALIDACION DEL DETALLE.
    if (!this.validarCantidadGrilla(this.listArticulosItem)) {
      return;
    }

    if (!this.validarLoteCantidadGrilla(this.listArticulosItem)) {
      return;
    }

    this.itemSelect.codSocioNegocio = (this.itemSelect.codSocioNegocio=="")? null:this.itemSelect.codSocioNegocio;
    this.itemSelect.nombreSocioNegocio = (this.itemSelect.nombreSocioNegocio=="")? null:this.itemSelect.nombreSocioNegocio;

    var personalContacto= (cbpersonal==undefined)? null:cbpersonal.label;
    var codPersonalContacto= (cbpersonal==undefined)? null:parseInt(cbpersonal.value);
    
    var destino= (cbdestino==undefined)? "":cbdestino.label;
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
      Interno:"SI",
      IdConfirmacionSolicitudTransferenciaTipoMovimiento:cbtipomoviento.value,
      DocEntry:this.itemSelect.atencionSolicitudTransferencia.docEntry,
      ConfirmacionSolicitudTransferenciaItem:this.listArticulosItem
    }
    
    this.confirmacionSolicitudTrasladoService.setConfirmacionSolicitudTrasladoRegistrar(value).subscribe(
      (result: IMensajeResultadoApi) =>{

        this.sessionStorage.setItemEncrypt('idconfirmacionsolicitudtraslado', result["idRegistro"]);
        this.mensajePrimeNgService.onToExitoMsg(null, result["resultadoDescripcion"]);
        
        if(result["idRegistro"]>0){
          
          document.getElementById("btnsave").remove();
          this.enviarSapTrasladoStock(result["idRegistro"]);
        }
        
      },
      
      (error) => this.mensajePrimeNgService.onToErrorMsg(null, error.error)

    );
 
  }

  loadubicaciones(){

  }
  
  listarGrilla(){    

    if(this.itemSelect.idConfirmacionSolicitudTransferencia== null){

      
        this.confirmacionSolicitudTrasladoService
        .getAtencionSolicitudTrasladoDetalle(this.itemSelect.idAtencionSolicitudTransferencia)
        .subscribe(
        (resp) => {
          
            var codAlmacenOrigen = this.itemSelect.codAlmacenOrigen;
            var codAlmacenDestino = this.itemSelect.codAlmacenDestino;
            
            this.listArticulosItem=resp;           
            this.listArticulosItem.forEach((item) => {

              if(item.isUbicacion=="Y"){
                var codArticulo = item.codArticulo;
                item.confirmacionSolicitudTransferenciaItemUbicacion=[];
                this.getUbicacion(codArticulo,codAlmacenOrigen,item,"origen","batFromWarehouse");
                this.getUbicacion(codArticulo,codAlmacenDestino,item,"destino","batToWarehouse");

              }
                
              });

          },
          err => {
            console.error(err);
            alert("Hubo un error al guardar los datos, intentelo de nuevo");
          }
          );
      
  }else{

        // no va
        this.formularioSuperior.patchValue({
          estado: "ATENDIDO",
        });
             
        this.confirmacionSolicitudTrasladoService
        .getConfirmacionSolicitudTrasladoDetalle(this.itemSelect.idAtencionSolicitudTransferencia)
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

  editarCantidadBuscado(event: any) {
    
      this.listArticulosItem.map(function(item){
        if(item.codArticulo == event.codArticulo && item.idAtencionSolicitudTransferenciaItem==event.idAtencionSolicitudTransferenciaItem){
            item.confirmacionSolicitudTransferenciaItemLote=event.lote;
        }
      });

  }

  clickActivateEditarCantidad() {
    this.isActivateCantidadEditar = !this.isActivateCantidadEditar;
  }

  loteCantida() {
    this.clickActivateEditarCantidad();
  }

  loteCantidaModel(item) {
    this.indiceItemElegidoGrilla = item;
    this.clickActivateEditarCantidad();
  }

  clickCancelar(){
    this.cancel.emit();
  }

  validarLoteCantidadGrilla(data: any[]) {

    let cantidadEntregada = 0;
    let valida = true;
    data.forEach((el) => {
      
      cantidadEntregada = 0;
      if (el.isLote=="Y") {
        
        
        if(el.confirmacionSolicitudTransferenciaItemLote==undefined){
          this.messageService.add({key: 'myKeyCrear', severity:'error', summary: 'Mensaje', detail: `INSERTE PORFAVOR EL LOTE DEL ARTICULO ${el.codArticulo} ${el.desArticulo}`});
          valida = false;
        } else{
        
            el.confirmacionSolicitudTransferenciaItemLote.forEach((item) => {
              cantidadEntregada +=item.cantidadEntregada
            });        

            if (cantidadEntregada != el.cantidadAtendida) {
              this.messageService.add({key: 'myKeyCrear', severity:'warn', summary: 'Mensaje', detail: `La cantidad del lote no correspoende a la cantidad por atender ${el.codArticulo} ${el.desArticulo}`});
              valida=false;
            }
        }
      }      
    });

      return valida;

  }

  ver(){

    this.isArticuloVerModal = !this.isArticuloVerModal;
    const { codArticulo,desArticulo } = this.indiceItemElegidoGrilla;
    this.tituloArticuloVerModal = `Ver Articulo - Id: ${codArticulo}`;

  }

  enviarSapTrasladoStock(id){

    this.confirmacionSolicitudTrasladoService
      .getAllById(id)
      .pipe(
        map((resp:any) => {
          
          var value={
            CardCode: resp.codSocioNegocio,
            CardName: resp.nombreSocioNegocio,
            ContactPerson:resp.codigoInternoContacto,
            Address: resp.destino,
            JournalMemo: resp.observacion,
            FromWarehouse: resp.codAlmacenOrigen,
            ToWarehouse: resp.codAlmacenDestino,
            U_SYP_MDTS: "TSI",
            U_SYP_MDMT: "11",
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
            
              if(itemLote.cantidadEntregada>0){

                var batchNumber={
                  BatchNumber: itemLote.numLote,
                  Quantity: itemLote.cantidadEntregada,
                  BaseLineNumber:item.numLinea,
                  ItemCode:item.codArticulo
                }
                
                itemLinea.BatchNumbers.push(batchNumber);

                }

            });
            
            item.confirmacionSolicitudTransferenciaItemUbicacion.forEach((itemUb) => {
            
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
                this.messageService.add({key: 'myKeyCrear', severity:'info', summary: 'Mensaje', detail: `SE ENVIO CORRECTAMENTE A SAP BO - DocEntry ${resp["docEntry"]}`});
              }else{
                this.messageService.add({key: 'myKeyCrear', severity:'error', summary: 'Mensaje', detail: ` ERROR DE ENVIAR A SAP BO : ${resp["mensaje"]}`});
              }
              
            })
          )
          .subscribe(
            (resp) => {
              //this.loading = false;            
            },
            (error) => {
              this.clickCancelar();
              this.messageService.add({key: 'myKeyCrear', severity:'error', summary: 'Mensaje', detail: ` ERROR DE ENVIAR A SAP BO EL TRASLADO DE STOCK`});

            }
          );

        })
      )
      .subscribe();

  }

  clickActivateUbicacion() {
    this.isActivateUbicacion = !this.isActivateUbicacion;
  }

  ubicacionModel(item,entorno) {
    
    if(entorno=="" || entorno==undefined) this.messageService.add({key: 'myKeyCrear', severity:'error', summary: 'Mensaje', detail: ` seleccione si es origen / destino el almacen`});

    this.indiceItemElegidoGrilla = item;
    this.ModalUbicacionItemCode=item.codArticulo;
    this.ModalUbicacionWhsCode=(entorno=='origen')? this.itemSelect.codAlmacenOrigen:this.itemSelect.codAlmacenDestino;
    this.ModalUbicacionEntorno=entorno;

    this.clickActivateUbicacion();

  }

  ubicacionSelecccioando(event: any) {
        
    console.log(this.indiceItemElegidoGrilla);
    var ubicacion = this.indiceItemElegidoGrilla.confirmacionSolicitudTransferenciaItemUbicacion;
    
    var index=undefined;
    var obj=undefined;

    if(event.entorno=="origen"){
      index = ubicacion.findIndex(x => x.TipoAccionContenedor === "batFromWarehouse");
      obj = ubicacion.find(x => x.TipoAccionContenedor === "batFromWarehouse");
    }

    if(event.entorno=="destino"){
      index = ubicacion.findIndex(x => x.TipoAccionContenedor === "batToWarehouse");
      obj = ubicacion.find(x => x.TipoAccionContenedor === "batToWarehouse");
    }

    this.indiceItemElegidoGrilla.confirmacionSolicitudTransferenciaItemUbicacion.splice(index, 1);

    var newObj={
      BinAbsEntry: event.binAbs,
      BinCode: event.binCode,
      Cantidad: obj.Cantidad,
      NumLineaBase: obj.NumLineaBase,
      PermitirCantidaNegativa: obj.PermitirCantidaNegativa,
      TipoAccionContenedor: obj.TipoAccionContenedor,
      codArticulo: obj.CodArticulo,
      ubicacionAlmacen: obj.UbicacionAlmacen,
      ubicacionCount: obj.UbicacionCount
    }
    
    this.indiceItemElegidoGrilla.confirmacionSolicitudTransferenciaItemUbicacion=[].concat(newObj).concat(ubicacion);
    
  }

  getUbicacion(itemCode,whsCode,item,almacen,tipoAccionContenedor) {

    this.confirmacionSolicitudTrasladoService
      .getUbicacionByItemWhs(itemCode,whsCode)
      .subscribe(
        (resp:any) => {
          
          if(resp.length>0){

            const tabla = {};
            const unicos = resp.filter((indice) => {
              return tabla.hasOwnProperty(indice.binAbs) ? false : (tabla[indice.binAbs] = true);
            });
          
            
            var ubicacionDefault ={
              BinAbsEntry: unicos[0].binAbs,
              BinCode: unicos[0].binCode,
              Cantidad: item.cantidadEntregada,      
              TipoAccionContenedor: tipoAccionContenedor,
              PermitirCantidaNegativa:"tNO",
              NumLineaBase: item.numLinea,
              CodArticulo:item.codArticulo,
              UbicacionCount:unicos.length,
              UbicacionAlmacen:almacen
            }

            if(almacen=="origen") item.UBOrigenBinAbs=unicos[0].binAbs;
            if(almacen=="destino") item.UBDestinoBinCode=unicos[0].binCode;
            item.confirmacionSolicitudTransferenciaItemUbicacion.push(ubicacionDefault); 

        }else{

            if(almacen=="origen") item.UBOrigenBinAbs="[SIN UBICACIÓN]";
            if(almacen=="destino") item.UBDestinoBinCode="[SIN UBICACIÓN]";
              
        }

        },
        (error) => {
          console.log(error);
        }
      );
  }

}
