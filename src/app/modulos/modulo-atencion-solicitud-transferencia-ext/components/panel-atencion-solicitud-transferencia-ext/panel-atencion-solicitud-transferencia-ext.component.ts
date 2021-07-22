import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { GlobalsConstantsForm } from '../../../../constants/globals-constants-form';
import { SelectItem } from 'primeng';
import { map, filter, mapTo } from 'rxjs/operators';//JC
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
import { AtencionSolicitudTrasladoService  } from '../../services/atencion-solicitud-traslado.service';

//Routing
import { Router } from '@angular/router';

@Component({
  selector: 'app-panel-atencion-solicitud-transferencia-ext',
  templateUrl: './panel-atencion-solicitud-transferencia-ext.component.html',
  styleUrls: ['./panel-atencion-solicitud-transferencia-ext.component.css']
})

export class PanelAtensionSolicitudTransferenciaExtComponent implements OnInit {
   // Titulo del componente
   titulo = 'Atención de Solicitud de Transferencia - Externo';
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
  tituloModalAtencionSolicitud: String="Atención de Solicitud de Traslado - externo";
  // Suscripcion [para realizar el unsuscription al cerrar el formulario]
  subscription$: Subscription;

  constructor(
    private readonly fb: FormBuilder,
    public readonly mensajePrimeNgService: MensajePrimeNgService,
    private readonly utilService: UtilService,
    public readonly lenguageService: LanguageService,
    private readonly atencionSolicitudTrasladoService: AtencionSolicitudTrasladoService,
    private readonly almacenService: AlmacenService,
    private readonly router: Router,
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
      { header: 'Nro Atención de Solicitud' },
      { header: 'Atención Solicitud Estado' },
      { header: 'Nro Solicitud' },
      { header: 'Solicitud Estado' },
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
        label: 'Atender',
        icon: 'pi pi-unlock',
        visible :true,
        command: () => {
          this.activarAtencionSolicitudCrear();
        },
      },
      {
        label: 'Anular',
        icon: 'pi pi-trash',
        visible :true,
        command: () => {
            this.anular();
        },
      },
      {
        label: 'Enviar a SAP BO',
        icon: 'pi pi-eye',
        command: () => {

          this.confirmationService.confirm({
            message: `Desea enviar a SAP BO la Atención solicitud de traslado con el Id ${this.itemSeleccionado.idAtencionSolicitudTransferencia} ?`,
            header: 'Envió a SAP BO',
            icon: 'pi pi-info-circle',
            acceptLabel: 'Si',
            rejectLabel: 'No',
            accept: () => {
              this.enviarSap();            
            }
          });
        },
      },
    ];
  }

  enviarSap(){
    
    this.atencionSolicitudTrasladoService
      .getAllById(this.itemSeleccionado.idAtencionSolicitudTransferencia)
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
            Id:resp.idAtencionSolicitudTransferencia,
            IdUsuario:this.userContextService.getIdUsuario(),
            value:value
          }

          this.atencionSolicitudTrasladoService
          .postSapSolicitudTraslado(send)
          .pipe(
            map((resp) => {
              
              if(resp["exito"]==true){
                this.messageService.add({key: 'myKeyAtencion', severity:'info', summary: 'Mensaje', detail: `[SAP BO] SE ENVIO LA SOLICITUD CORRECTAMENTE - DocEntry ${resp["docEntry"]}`});
              }else{
                this.messageService.add({key: 'myKeyAtencion', severity:'error', summary: 'Mensaje', detail: ` ERROR DE ENVIAR A SAP BO LA SOLICITUD: ${resp["mensaje"]}`});
              }

              this.onListar();
              
            })
          )
          .subscribe(
            (resp) => {
              //this.loading = false;            
            },
            (error) => {
              
              this.messageService.add({key: 'myKeyAtencion', severity:'error', summary: 'Mensaje', detail: ` ERROR DE ENVIAR A SAP BO LA SOLICITUD`});

            }
          );

        })
      )
      .subscribe();

  }

  
  ver() {

    this.isVerModal = !this.isVerModal;
    const { idAtencionSolicitudTransferencia } = this.itemSeleccionado;
    this.tituloModalVer = `Atención Solicitud de traslado Externo Ver - Id: ${idAtencionSolicitudTransferencia}`;
  }

  itemElegido(datosDelSeleccionado) {
  
    var id = datosDelSeleccionado.idAtencionSolicitudTransferencia
    this.itemSeleccionado = datosDelSeleccionado;
    
    
    if(id>0 && datosDelSeleccionado.desAtencionSolicitudTransferenciaEstado !="ANULADO"){

      if(datosDelSeleccionado.docEntry>0)
      {
        this.opciones.find(x=>x.label=="Anular").visible=false;
      }else{
        this.opciones.find(x=>x.label=="Anular").visible=true;
      }
      
      this.opciones.find(x=>x.label=="Ver").visible=true;
      this.opciones.find(x=>x.label=="Atender").visible=false;
    }else{

      this.opciones.find(x=>x.label=="Anular").visible=false;
      this.opciones.find(x=>x.label=="Ver").visible=false;

      if(datosDelSeleccionado.generarNuevo=="SI"){
        this.opciones.find(x=>x.label=="Atender").visible=true;
      }else{
        this.opciones.find(x=>x.label=="Atender").visible=false;
      }
    }

    if(datosDelSeleccionado.docEntry>0){
      this.opciones.find(x=>x.label=="Enviar a SAP BO").visible=false;
    }else{
          //generado
      if(datosDelSeleccionado.idAtencionSolicitudTransferenciaEstado==1){
        this.opciones.find(x=>x.label=="Enviar a SAP BO").visible=true;
      }else{
        this.opciones.find(x=>x.label=="Enviar a SAP BO").visible=false;
      }
      
    }
    
  }
  
  onListar() {

    this.idResaltar = (this.sessionStorage.getItemDecrypt('idatencionsolicitudtraslado-ext'))? parseInt(this.sessionStorage.getItemDecrypt('idatencionsolicitudtraslado-ext')):0;

    const formBody = this.formularioBusqueda.value;
    const fechaIn = this.utilService.fecha_AAAAMMDD(formBody.fechaInicio);
    const fechaFin = this.utilService.fecha_AAAAMMDD(formBody.fechaFin);

    const numsolicitud = formBody.numsolicitud;
    
    this.loading = true;

    this.atencionSolicitudTrasladoService
      .getParamTransferecias(fechaIn, fechaFin,numsolicitud,this.codAlmacenOrigen,this.codAlmacenDestino)
      .pipe(map((resp) => (this.listGrilla = resp)))
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

  anular(){

    this.confirmationService.confirm({
      message: `Desea anular la Atención solicitud de traslado Externo con el Id ${this.itemSeleccionado.idAtencionSolicitudTransferencia} ?`,
      header: this.globalConstants.titleAnular,
      icon: 'pi pi-info-circle',
      acceptLabel: 'Si',
      rejectLabel: 'No',
      accept: () => {
        
        var reqAnular={
          IdAtencionSolicitudTransferencia:this.itemSeleccionado.idAtencionSolicitudTransferencia,
          IdSolicitudTraslado:this.itemSeleccionado.idSolicitudTraslado,
          ReUpdateIdUsuario:this.userContextService.getIdUsuario()
        }

        this.atencionSolicitudTrasladoService.anularAtencionSolicitud(reqAnular).subscribe(
          (resp: any) => {
            
            this.mensajePrimeNgService.onToExitoMsg(null, resp.resultadoDescripcion);
            this.onListar();
          },
          (error) => {
            this.mensajePrimeNgService.onToErrorMsg(undefined, error.error);
          }
        );
        
      },
    });

  }

  activarAtencionSolicitudCrear() {

    this.isActivateAtencionSolicitudCrear = !this.isActivateAtencionSolicitudCrear;
    if(this.isActivateAtencionSolicitudCrear==false) this.onListar();
    
  }


}