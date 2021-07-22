import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { GlobalsConstantsForm } from '../../../../constants/globals-constants-form';
import { SelectItem } from 'primeng';
import { map, filter, mapTo } from 'rxjs/operators';
import { MessageService } from 'primeng/api';

//constantes
import { ConstantesGenerales } from '../../../../constants/Constantes-generales';
import { ConfirmationService } from 'primeng/api';

//services
import { UserContextService } from '../../../../services/user-context.service';
import { SessionService } from '../../../../services/session.service';
import { MensajePrimeNgService } from '../../../../services/mensaje-prime-ng.service';
import { UtilService } from '../../../../services/util.service';
import { LanguageService } from '../../../../services/language.service';
import { AlmacenService } from '../../services/almacen.service';
import { ConfirmacionSolicitudTrasladoService  } from '../../services/confirmacion-solicitud-traslado.service';

//Routing
import { Router } from '@angular/router';

@Component({
  selector: 'app-panel-confirmacion-solicitud-transferencia-ext',
  templateUrl: './panel-confirmacion-solicitud-transferencia-ext.component.html',
  styleUrls: ['./panel-confirmacion-solicitud-transferencia-ext.component.css']
})

export class PanelConfirmacionSolicitudTransferenciaExtComponent implements OnInit {
  // Titulo del componente
  titulo = 'Confirmación de Solicitud de Transferencia - Externo';
 // Name de los botones de accion
 globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm();
 timeAnimationModal = ConstantesGenerales.DURACION_ANIMACION_MODAL;

 // Formulario de Busqueda
 formularioBusqueda: FormGroup;
 loading = false;

 //variables
 inputAlmacen: string="";
 codAlmacenOrigen:string="";
 codAlmacenDestino:string="";

 //Grilla
 listGrilla: any = [];
 columnas: any[];
 itemSeleccionado: any;
 opciones: any = [];
 idResaltar: number = 0;

 // Select
 rowMotivo: SelectItem[];
 rowMotivoSelect: any;
 
 rowAlmacenOrigen: SelectItem[];
 selectedAlmacenOrigen: any;
 
 rowAlmacenDestino: SelectItem[];
 selectedAlmacenDestino: any;

 //modal ver
 isVerModal = false;
 tituloModalVer: any;

 //modal almacen
 isActivateBusquedaAlmacen: boolean = false;

 //modal crear
 isActivateAtencionSolicitudCrear: boolean = false;
 tituloModalAtencionSolicitud: String="Transferencia de stock";
 // Suscripcion [para realizar el unsuscription al cerrar el formulario]
 subscription$: Subscription;

 constructor(
   private readonly fb: FormBuilder,
   public readonly mensajePrimeNgService: MensajePrimeNgService,
   private readonly utilService: UtilService,
   public readonly lenguageService: LanguageService,
   private readonly confirmacionSolicitudTrasladoService: ConfirmacionSolicitudTrasladoService,
   private readonly sessionStorage: SessionService,
   public userContextService: UserContextService,
   private readonly confirmationService: ConfirmationService,
   private messageService: MessageService,
 ) { }

 ngOnInit() {   

   this.onbuildForm();
   this.onTableColumna();
   this.opcionesTabla();
       
   this.onListar();
   
 }

 private onbuildForm() {
   this.formularioBusqueda = this.fb.group({
     fechaInicio: new Date(),
     fechaFin: new Date(),
     numsolicitud:'',
     almacenOrigen:'',
     almacenDestino:''
   });
 }

 onToBuscar() {
   this.onListar();
 }

 onTableColumna(){

   this.columnas = [
     { header: 'Opciones' },
     { header: 'Nro Confirmación de Solicitud' },
     { header: 'Fecha Confirmación Registro' },
     { header: 'Nro Atención' },
     { header: 'Nro Solicitud' },
     { header: 'Nro Solicitud Estado' },
     { header: 'Fecha Solicitud Registro' },
     { header: 'Socio de Negocio' },
     { header: 'Almacén Origen' },
     { header: 'Almacén Destino' },
     { header: 'Responsable' },
     { header: 'Comentario' },
     { header: 'DocEntry' }
   ];
 }

 opcionesTabla() {
   this.opciones = [
     {
       label: 'Ver',
       icon: 'pi pi-eye',
       visible :true,
       command: () => {
         this.ver();
       },
     },
     {
       label: 'Confirmar',
       icon: 'pi pi-unlock',
       visible :true,
       command: () => {
         this.activarAtencionSolicitudCrear();
       },
     },
     {
      label: 'Enviar a SAP BO',
      icon: 'pi pi-eye',
      command: () => {

        this.confirmationService.confirm({
          message: `Desea enviar a SAP BO el traslado de stock, la confirmacion con el Id ${this.itemSeleccionado.idConfirmacionSolicitudTransferencia} ?`,
          header: 'Envió a SAP BO',
          icon: 'pi pi-info-circle',
          acceptLabel: 'Si',
          rejectLabel: 'No',
          accept: () => {
            this.enviarSapTrasladoStock();            
          }
        });
      },
    },
   ];

 }

 
 ver() {

   this.isVerModal = !this.isVerModal;
   const { idConfirmacionSolicitudTransferencia } = this.itemSeleccionado;
   this.tituloModalVer = `Confirmación Solicitud de traslado Ver - Id: ${idConfirmacionSolicitudTransferencia}`;
 }

 itemElegido(datosDelSeleccionado) {
   
   var id = datosDelSeleccionado.idConfirmacionSolicitudTransferencia
   this.itemSeleccionado = datosDelSeleccionado;
   
   if(id>0){
     this.opciones.find(x=>x.label=="Ver").visible=true;
     this.opciones.find(x=>x.label=="Confirmar").visible=false;
   }else{
     this.opciones.find(x=>x.label=="Ver").visible=false;
     this.opciones.find(x=>x.label=="Confirmar").visible=true;
   }

   if(datosDelSeleccionado.docEntry>0){
    this.opciones.find(x=>x.label=="Enviar a SAP BO").visible=false;
  }else{
    if(datosDelSeleccionado.idConfirmacionSolicitudTransferenciaEstado==1){
      this.opciones.find(x=>x.label=="Enviar a SAP BO").visible=true;
    }else{
      this.opciones.find(x=>x.label=="Enviar a SAP BO").visible=false;
    }
  }
   
 }
 
 onListar() {

  this.idResaltar = (this.sessionStorage.getItemDecrypt('idconfirmacionsolicitudtraslado-ext'))? parseInt(this.sessionStorage.getItemDecrypt('idconfirmacionsolicitudtraslado-ext')):0;


   const formBody = this.formularioBusqueda.value;
   const fechaIn = this.utilService.fecha_AAAAMMDD(formBody.fechaInicio);
   const fechaFin = this.utilService.fecha_AAAAMMDD(formBody.fechaFin);

   const numsolicitud = formBody.numsolicitud;
   
   this.loading = true;

   this.confirmacionSolicitudTrasladoService
     .getParamTransferecias(fechaIn, fechaFin,numsolicitud,this.codAlmacenOrigen,this.codAlmacenDestino)
     .pipe(map((resp) => {

      this.listGrilla = resp;
      
     }))
     .subscribe(
       (resp) => {
         this.loading = false;
       },
       (error) => {
         this.mensajePrimeNgService.onToErrorMsg(null, error)
       }
     );
 }


 almacenSeleccionado(event: any) {
  
   if(this.inputAlmacen=="origen"){
       this.codAlmacenOrigen = event.warehouseCode;
       this.formularioBusqueda.patchValue({
         almacenOrigen: event.warehouseCode+" "+event.warehouseName
       });
   }
     else{
         this.codAlmacenDestino = event.warehouseCode;
         this.formularioBusqueda.patchValue({
           almacenDestino: event.warehouseCode+" "+event.warehouseName
         });
     }
  
 }

 activarModalAlmacen(input="") {
   
   this.inputAlmacen=input;
   this.isActivateBusquedaAlmacen = !this.isActivateBusquedaAlmacen;
 }
 
 emptyInputAlmacen(input="") {

   if(input=="origen"){
       this.codAlmacenOrigen = "";
       this.formularioBusqueda.patchValue({
         almacenOrigen: ""
       });
   }
   else{
       this.codAlmacenDestino = "";
       this.formularioBusqueda.patchValue({
         almacenDestino: ""
       });
   }
   
 }

 activarAtencionSolicitudCrear() {

   this.isActivateAtencionSolicitudCrear = !this.isActivateAtencionSolicitudCrear;
   if(this.isActivateAtencionSolicitudCrear==false) this.onListar();
   
 }

 enviarSapTrasladoStock(){
  
  this.confirmacionSolicitudTrasladoService
    .getAllById(this.itemSeleccionado.idConfirmacionSolicitudTransferencia)
    .pipe(
      map((resp:any) => {
          
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

            if(resp["exito"]==true){
              this.messageService.add({key: 'confirmacionExt', severity:'info', summary: 'Mensaje', detail: `SE ENVIO CORRECTAMENTE A SAP BO - DocEntry ${resp["docEntry"]}`});
            }else{
              this.messageService.add({key: 'confirmacionExt', severity:'error', summary: 'Mensaje', detail: ` ERROR DE ENVIAR A SAP BO : ${resp["mensaje"]}`});
            }
            this.onListar();
            
          })
        )
        .subscribe(
          (resp) => {
            //this.loading = false;            
          },
          (error) => {
            
            this.messageService.add({key: 'confirmacionExt', severity:'error', summary: 'Mensaje', detail: ` ERROR DE ENVIAR A SAP BO LA SOLICITUD`});

          }
        );

      })
    )
    .subscribe();

}

}