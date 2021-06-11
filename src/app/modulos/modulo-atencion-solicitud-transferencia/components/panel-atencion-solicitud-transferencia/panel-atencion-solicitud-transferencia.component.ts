import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { GlobalsConstantsForm } from '../../../../constants/globals-constants-form';
import { SelectItem } from 'primeng';
import { map, filter, mapTo } from 'rxjs/operators';//JC

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
//atencion-solicitud-traslado
//Routing
import { Router } from '@angular/router';
import { debug } from 'console';

@Component({
  selector: 'app-panel-atencion-solicitud-transferencia',
  templateUrl: './panel-atencion-solicitud-transferencia.component.html',
  styleUrls: ['./panel-atencion-solicitud-transferencia.component.css']
})

export class PanelAtensionSolicitudTransferenciaComponent implements OnInit {
   // Titulo del componente
   titulo = 'Atención de Solicitud de Transferencia - Interno';
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
  tituloModalAtencionSolicitud: String="Solicitud de Transferencia de stock";
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
  ) { }

  ngOnInit() {
    this.onbuildForm();
    this.onTableColumna();
    this.opcionesTabla();
        
    this.onListar();
    debugger
    this.idResaltar = (this.sessionStorage.getItemDecrypt('idatencionsolicitudtraslado'))? parseInt(this.sessionStorage.getItemDecrypt('idatencionsolicitudtraslado')):0;

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
      { header: 'Nro Atencion de Solicitud' },
      { header: 'Nro Atencion Solicitud Estado' },
      { header: 'Nro Solicitud' },
      { header: 'Nro Solicitud Estado' },
      { header: 'Socio de Negocio' },
      { header: 'Fecha Registro' },
      { header: 'Almacen Origen' },
      { header: 'Almacen Destino' },
      { header: 'Responsable' },
      { header: 'Comentario' }
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
    ];
  }

  
  ver() {

    this.isVerModal = !this.isVerModal;
    const { idAtencionSolicitudTransferencia } = this.itemSeleccionado;
    this.tituloModalVer = `Atención Solicitud de traslado Ver - Id: ${idAtencionSolicitudTransferencia}`;
  }

  itemElegido(datosDelSeleccionado) {
    
    var id = datosDelSeleccionado.idAtencionSolicitudTransferencia
    this.itemSeleccionado = datosDelSeleccionado;
    
    if(id>0 && datosDelSeleccionado.desAtencionSolicitudTransferenciaEstado !="ANULADO"){
      this.opciones.find(x=>x.label=="Anular").visible=true;
      this.opciones.find(x=>x.label=="Ver").visible=true;
    }else{
      this.opciones.find(x=>x.label=="Anular").visible=false;
      this.opciones.find(x=>x.label=="Ver").visible=false;
    }
    
  }
  
  onListar() {

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
    debugger;
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

    debugger;


    this.confirmationService.confirm({
      message: `Desea anular la Atención solicitud de traslado con el Id ${this.itemSeleccionado.idAtencionSolicitudTransferencia} ?`,
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