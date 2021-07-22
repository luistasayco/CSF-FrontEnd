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
  selector: 'app-atencion-solicitud-transferencia-ext-crear',
  templateUrl: './atencion-solicitud-transferencia-ext-crear.component.html',
  styleUrls: ['./atencion-solicitud-transferencia-ext-crear.component.css']
})

export class AtensionSolicitudTransferenciaExtCrearComponent implements OnInit {
  formularioSuperior: FormGroup; //jc
  // Suscripcion [para realizar el unsuscription al cerrar el formulario]
  subscription$: Subscription;
  timeAnimationModal = ConstantesGenerales.DURACION_ANIMACION_MODAL;
    
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
  
  // tipo de documento
  rowDocumentoGuia: any[];
  rowTipoDocumento: SelectItem[];
  tipoDocumentoSelect:any;
  rowSerie: SelectItem[];
  serieSelect:any;

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
    this.opcionesTabla();
    this.listarGrilla();
    this.rowTipoMovimiento=[];
    this.rowTipoMovimiento.push({"value":1,"label":"DESCARGO POR TRANSFERENCIA"});
    this.tipoMovimientoSelect = this.rowTipoMovimiento[0];
    
    this.BPDireccionesContactos();
    this.selectGuia();
    this.onTableColumna();
    
  }

  onTableColumna(){

    this.columnas = [
      { header: 'Opciones' },
      { header: 'Num Linea' },
      { header: 'Cod Articulo' },
      { header: 'Descripción Articulo' },
      { header: 'Almacén Origen' },
      { header: 'O Ubicación' },
      { header: 'Almacén Destino' },
      { header: 'D Ubicación' },
      { header: 'Cantidad Solicitada' },
      { header: 'Cantidad Atendida' },
      { header: 'Lote' },
      { header: 'Ubicación' },
      { header: 'Codigo Unidad' },
    ];
    
  }

private buildFormSuperior() {


  this.selectAlmacenOrigen = {codAlmacenOrigen:this.itemSelect.codAlmacenOrigen,desAlmacenOrigen:this.itemSelect.almacenOrigen.warehouseName};

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
    cbtipodocumento:'',
    cbSerie:'',
    numero:'',
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
      cbSerie,
      numero,
      observacion
    } = this.formularioSuperior.value;
    

    // if(desSocioNegocio=="" || this.itemSelect.codSocioNegocio==""){
    //   this.messageService.add({key: 'myKeyCrear', severity:'warn', summary: 'Mensaje', detail: `SELECCIONE UN UN SOCIO DE NEGOCIO`});
    //   return;
    // }

    // if(cbdestino == undefined || cbdestino==""){
    //   this.messageService.add({key: 'myKeyCrear', severity:'warn', summary: 'Mensaje', detail: `SELECCIONE UN DESTINO`});
    //   return;
    // }
    

    if(almacenOrigen=="" || this.itemSelect.codAlmacenOrigen==""){
       this.messageService.add({key: 'myKeyCrear', severity:'warn', summary: 'Mensaje', detail: `SELECCIONE EL ALMACEN ORIGEN`});
       return;
     }

     if(almacenDestino=="" || this.itemSelect.codAlmacenDestino==""){
      this.messageService.add({key: 'myKeyCrear', severity:'warn', summary: 'Mensaje', detail: `SELECCIONE EL ALMACEN DESTINO`});
      return;
    }

    if(cbSerie==undefined || cbSerie==""){
      this.messageService.add({key: 'myKeyCrear', severity:'warn', summary: 'Mensaje', detail: `SELECCIONE LA SERIE DEL DOCUMENTO`});
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
    var codPersonalContacto= (cbpersonal==undefined)? null: parseInt(cbpersonal.value);
    
    var destino= (cbdestino==undefined)? null:cbdestino.label;
    var idref = this.itemSelect.idSolicitudTraslado;

    // actualizacion de cantidad en las ubicacion
    Array.from(this.listArticulosItem, x => {
      Array.from(x["atencionSolicitudTransferenciaItemUbicacion"], item => {
        item["Cantidad"]=x["cantidadAtendida"];
      });
      
    });

    var value={
      IdSolicitudTraslado:idref,
      CodSocioNegocio:this.itemSelect.codSocioNegocio,
      NombreSocioNegocio: this.itemSelect.nombreSocioNegocio,//desSocioNegocio,
      CodigoInternoContacto: codPersonalContacto,
      Contacto: personalContacto,
      Destino:destino,
      RegCreateIdUsuario:this.userContextService.getIdUsuario(),
      CodAlmacenOrigen: this.itemSelect.codAlmacenOrigen,
      DesAlmacenOrigen:this.itemSelect.almacenOrigen.warehouseName,
      CodAlmacenDestino:this.itemSelect.codAlmacenDestino,
      DesAlmacenDestino:this.itemSelect.almacenDestino.warehouseName,
      Observacion:observacion,
      Interno:"NO",
      CodDocumento:this.tipoDocumentoSelect.value,
      Documento:this.tipoDocumentoSelect.label,
      Serie:cbSerie.label,
      Numero:numero,
      IdAtencionSolicitudTransferenciaTipoMovimiento:cbtipomoviento.value,
      AtencionSolicitudTransferenciaItem:this.listArticulosItem
    }
    
    this.atencionSolicitudTrasladoService.setAtencionSolicitudTrasladoRegistrar(value).subscribe(
      (result: IMensajeResultadoApi) =>{

        this.sessionStorage.setItemEncrypt('idatencionsolicitudtraslado-ext', result["idRegistro"]);
        this.mensajePrimeNgService.onToExitoMsg(null, result["resultadoDescripcion"]);
        
        if(result["idRegistro"]>0){
          
          document.getElementById("btnsave").remove();
          this.envioSap(result["idRegistro"]);
        }

      },
      
      (error) => this.mensajePrimeNgService.onToErrorMsg(null, error.error)

    );

  }

  
  listarGrilla(){
    
    this.atencionSolicitudTrasladoService
        .getSolicitudTrasladoDetalle(this.itemSelect.idSolicitudTraslado)
        .subscribe(
        (resp) => {

            this.loading = false;

            var codAlmacenOrigen = this.itemSelect.codAlmacenOrigen;
            var codAlmacenDestino = this.itemSelect.codAlmacenDestino;
            
            this.listArticulosItem=resp;           
            this.listArticulosItem.forEach((item) => {

              if(item.isUbicacion=="Y"){
                var codArticulo = item.codArticulo;
                item.atencionSolicitudTransferenciaItemUbicacion=[];
                this.getUbicacion(codArticulo,codAlmacenOrigen,item,"origen","batFromWarehouse",codAlmacenDestino);
                // setTimeout(() => {
                //   console.log("listarGrilla setTimeout");
                //   console.log(item);
                // }, 10);

              }
                
              });

          },
          err => {
            console.error(err);
            alert("Hubo un error al guardar los datos, intentelo de nuevo");
          }
          );

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

  validarLoteCantidadGrilla(data: any[]) {
    
    let cantidadAtendida = 0;
    let valida = true;
    data.forEach((el) => {
      
      cantidadAtendida = 0;
      if (el.isLote=="Y") {

        if(el.atencionSolicitudTransferenciaItemLote==undefined){
          this.messageService.add({key: 'myKeyCrear', severity:'error', summary: 'Mensaje', detail: `INSERTE PORFAVOR EL LOTE DEL ARTICULO ${el.codArticulo} ${el.desArticulo}`});
          valida = false;
        } else{

            el.atencionSolicitudTransferenciaItemLote.forEach((item) => {
              cantidadAtendida +=item.cantidadAtendida
            });        

            if (cantidadAtendida != el.cantidadAtendida) {
              this.messageService.add({key: 'myKeyCrear', severity:'warn', summary: 'Mensaje', detail: `La cantidad del lote no correspoende a la cantidad por atender ${el.codArticulo} ${el.desArticulo}`});
              valida=false;
            }
        }
      }      
    });

      return valida;

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



  selectGuia(){
    
    
    this.atencionSolicitudTrasladoService
        .getDocGuia()
        .pipe(
          map((resp:any) => {

            this.rowDocumentoGuia=resp;

            this.rowSerie=[];
            Array.from(resp, x => {
              this.rowSerie.push({ value:1,label:x["u_SYP_NDSD"]});
            });

              this.rowTipoDocumento=[];
              this.rowTipoDocumento.push({ value:resp[0].code,label:resp[0].u_SYP_TDDD});
              this.tipoDocumentoSelect=this.rowTipoDocumento[0];

          })
        )
        .subscribe(
          (resp) => {
           
          },
          (error) => {
            this.mensajePrimeNgService.onToErrorMsg(null, "Error: cargar servicio de tipo documento guia / documento no existe");
            console.log(error);
          }
        );
  }

  editarCantidadBuscado(event: any) {
    
    this.listArticulosItem.map(function(item){
      if(item.codArticulo == event.codArticulo && item.idSolicitudTrasladoItem==event.idSolicitudTrasladoItem){
          item.atencionSolicitudTransferenciaItemLote=event.lote;
      }
    });

}

clickActivateEditarCantidad() {
  this.isActivateCantidadEditar = !this.isActivateCantidadEditar;
}

loteCantida() {
  
  this.clickActivateEditarCantidad();
}

ver(){
  
  this.isArticuloVerModal = !this.isArticuloVerModal;
  const { codArticulo,desArticulo } = this.indiceItemElegidoGrilla;
  this.tituloArticuloVerModal = `Ver Articulo - Id: ${codArticulo}`;

}

envioSap(idAtencion) {

  this.atencionSolicitudTrasladoService
      .getAllById(idAtencion)
      .pipe(
        map((resp:any) => {
          
          var value={
            CardCode: resp.codSocioNegocio,
            CardName: resp.nombreSocioNegocio,
            ContactPerson: resp.codigoInternoContacto,
            Address: resp.destino,
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

          resp.atencionSolicitudTransferenciaItem.forEach((item) => {
    
            var itemLinea ={
              LineNum: item.numLinea,
              ItemCode: item.codArticulo,
              ItemDescription: item.desArticulo,
              Quantity: item.cantidadAtendida,
              FromWarehouseCode: resp.codAlmacenOrigen,
              WarehouseCode: resp.codAlmacenDestino,
              ProjectCode: "",
              BatchNumbers:[],
              StockTransferLinesBinAllocations:[]
            }

            item.atencionSolicitudTransferenciaItemLote.forEach((itemLote) => {

              if(itemLote.cantidadAtendida>0){

                  var batchNumber={
                    BatchNumber: itemLote.numLote,
                    Quantity: itemLote.cantidadAtendida,
                    BaseLineNumber:item.numLinea,
                    ItemCode:item.codArticulo
                  }
                  
                    itemLinea.BatchNumbers.push(batchNumber);
                  }
        
            });

            
            item.atencionSolicitudTransferenciaItemUbicacion.forEach((itemUb) => {
            
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
            Id:idAtencion,
            IdUsuario:this.userContextService.getIdUsuario(),
            value:value
          }

          this.atencionSolicitudTrasladoService
          .postSapSolicitudTraslado(send)
          .pipe(
            map((resp) => {
    
              this.clickCancelar();

              if(resp["exito"]==true){
                this.messageService.add({key: 'myKeyAtencion', severity:'info', summary: 'Mensaje', detail: `SE ENVIO CORRECTAMENTE A SAP BO - DocEntry ${resp["docEntry"]}`});
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

        })).subscribe();

    }

    loteCantidaModel(item) {
      this.indiceItemElegidoGrilla = item;
      this.clickActivateEditarCantidad();
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
         
  
      var ubicacion = this.indiceItemElegidoGrilla.atencionSolicitudTransferenciaItemUbicacion;
      
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
  
      this.indiceItemElegidoGrilla.atencionSolicitudTransferenciaItemUbicacion.splice(index, 1);
  
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
      
      this.indiceItemElegidoGrilla.atencionSolicitudTransferenciaItemUbicacion=[].concat(newObj).concat(ubicacion);
  
    }

    getUbicacion(itemCode,whsCode,item,almacen,tipoAccionContenedor,codAlmacenDestino) {

      this.atencionSolicitudTrasladoService
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
                Cantidad: item.cantidadAtendida,      
                TipoAccionContenedor: tipoAccionContenedor,
                PermitirCantidaNegativa:"tNO",
                NumLineaBase: item.numLinea,
                CodArticulo:item.codArticulo,
                UbicacionCount:unicos.length,
                UbicacionAlmacen:almacen
              }
              
              item.UBOrigenBinAbs=unicos[0].binAbs;

              //if(almacen=="origen") item.UBOrigenBinAbs=unicos[0].binAbs;
              //if(almacen=="destino") item.UBDestinoBinCode=unicos[0].binCode;            
              item.atencionSolicitudTransferenciaItemUbicacion.push(ubicacionDefault);
              this.getUbicacionDes(itemCode,codAlmacenDestino,item,"destino","batToWarehouse");
          }else{

            item.UBOrigenBinAbs="[SIN UBICACIÓN]";
            //if(almacen=="origen") item.UBOrigenBinAbs="[SIN UBICACIÓN]";
            //if(almacen=="destino") item.UBDestinoBinCode="[SIN UBICACIÓN]";

          }
  
          },
          (error) => {
            console.log(error);
          }
        );
    }

    getUbicacionDes(itemCode,whsCode,item,almacen,tipoAccionContenedor) {

      this.atencionSolicitudTrasladoService
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
                Cantidad: item.cantidadAtendida,      
                TipoAccionContenedor: tipoAccionContenedor,
                PermitirCantidaNegativa:"tNO",
                NumLineaBase: item.numLinea,
                CodArticulo:item.codArticulo,
                UbicacionCount:unicos.length,
                UbicacionAlmacen:almacen
              }
  
              //if(almacen=="origen") item.UBOrigenBinAbs=unicos[0].binAbs;
              //if(almacen=="destino") item.UBDestinoBinCode=unicos[0].binCode;
              item.UBDestinoBinCode=unicos[0].binCode;
              item.atencionSolicitudTransferenciaItemUbicacion.push(ubicacionDefault);
          }else{

            //if(almacen=="origen") item.UBOrigenBinAbs="[SIN UBICACIÓN]";
            //if(almacen=="destino") item.UBDestinoBinCode="[SIN UBICACIÓN]";
            item.UBDestinoBinCode="[SIN UBICACIÓN]";
          }
  
          },
          (error) => {
            console.log(error);
          }
        );
    }

    onChangeSerie(){
      
        var cor = this.rowDocumentoGuia.find(x=>x.u_SYP_TDDD==this.tipoDocumentoSelect.label && x.u_SYP_NDSD==this.serieSelect.label)
         this.formularioSuperior.patchValue({
              numero:cor.u_SYP_NDCD
            });

    }


}
