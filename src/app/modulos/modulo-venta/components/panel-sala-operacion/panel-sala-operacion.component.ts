import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { BreadcrumbService } from '../../../../services/breadcrumb.service';
import { GlobalsConstantsForm } from '../../../../constants/globals-constants-form';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { VentasService } from '../../services/ventas.service';
import { LanguageService } from '../../../../services/language.service';
import { map } from 'rxjs/operators';
import { IResultBusquedaSalaOperacion, ISalaOperacionEliminar, IResultBusquedaSalaOperacionRol, ISalaOperacionModificarRol } from '../../interface/sala-operacion.interface';
import { MenuItem } from 'primeng/api';
import swal from'sweetalert2';

@Component({
  selector: 'app-panel-sala-operacion',
  templateUrl: './panel-sala-operacion.component.html',
  styleUrls: ['./panel-sala-operacion.component.css']
})
export class PanelSalaOperacionComponent implements OnInit, OnDestroy {
  // Titulo del componente
  titulo = 'Sala de Operación';
  // Name de los botones de accion
  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm();

  // Formulario
  formularioBusqueda: FormGroup;
  formularioAtencion: FormGroup;
  subscription$: Subscription;
  loading: boolean;
  items: MenuItem[];
  listModelo: IResultBusquedaSalaOperacion[];
  itemSeleccionadoGrilla: IResultBusquedaSalaOperacion;
  indexSeleccionadoGrilla: number;
  isDisplaySave: boolean;
  isDisplaySOP: boolean;
  columnas: any;

  constructor(private breadcrumbService: BreadcrumbService,
              private readonly formBuilder: FormBuilder,
              private readonly ventasService: VentasService,
              public lenguageService: LanguageService,
              private readonly router: Router) { 
    this.breadcrumbService.setItems([
      { label: 'Módulo Venta' },
      { label: 'Sala Operación', routerLink: ['module-ve/panel-venta'] }
    ]);
  }

  ngOnInit(): void {
    this.buildForm();
    this.onHeaderGrilla();
    this.onOpcionesGrilla();
    this.goListar();
  }

  private buildForm() {
    this.formularioBusqueda = this.formBuilder.group({
      fechaIni: [new Date],
      fechaFin: [new Date]
    });

    this.formularioAtencion = this.formBuilder.group({
      codatencion: [null]
    });
  }

  private onHeaderGrilla(){
    this.columnas = [
      { field: 'codrolsala', header: 'Rol Operación' },
      { field: 'operacion', header: 'Operación' },
      { field: 'codatencion', header: 'Cod.Atención' },
      { field: 'nombres', header: 'Paciente' },
      { field: 'desalmacen', header: 'Almacén' },
      { field: 'fechahoraregistro', header: 'Fecha' },
      { field: 'flgestado', header: 'Cerrado' },
      { field: 'flgventa', header: 'Venta' },
      { field: 'codventa', header: 'Cod.Venta' }
    ];
  }
  
  goItemElegido(value: IResultBusquedaSalaOperacion, index: number) {
    this.itemSeleccionadoGrilla = value;
    this.indexSeleccionadoGrilla = index;
  }

  private onOpcionesGrilla() {
    this.items = [
      {label: 'Asignar Rol Operación', icon: this.globalConstants.icoGenerico, command: () => {
        this.onActivarRolAtencion();
      }},
      {label: 'Generar Vale de Venta', icon: this.globalConstants.icoGenerico, command: () => {
        this.onGenerarValeVenta();
      }},
      {label: this.globalConstants.cEliminar, icon: this.globalConstants.icoEliminar, command: () => {
        this.onEliminar();
      }}
    ];
  }

  goListar() {
    debugger;
    let body = this.formularioBusqueda.value;
    this.listModelo = [];
    this.loading = true;
    this.subscription$ = new Subscription();
    this.subscription$ = this.ventasService.getListSalaOperacionPorFiltro(body.fechaIni, body.fechaFin)
    .pipe(
      map((resp: IResultBusquedaSalaOperacion[]) => {
          this.listModelo = resp;
          this.loading = false;
        }
      )
    )
    .subscribe(  
    (resp) => {},
    (error) => {
      this.loading = false;
      swal.fire(this.globalConstants.msgErrorSummary, error.error.resultadoDescripcion,'error')
    });
  }

  onActivarRolAtencion() {
    this.isDisplaySOP = !this.isDisplaySOP;
  }

  goAsignarRolOperacion() {
    let body = this.formularioAtencion.value;

    if (body.codatencion === null || body.codatencion === '') {
      swal.fire(this.globalConstants.msgInfoSummary, 'Ingresar Correctamente el Cod. Atención','info')
      return;
    }

    if (body.codatencion.length < 8) {
      swal.fire(this.globalConstants.msgInfoSummary, 'Ingresar Correctamente el Cod. Atención','info')
      return;
    }

    if (this.listModelo[this.indexSeleccionadoGrilla].codatencion !== null) {
      if (this.listModelo[this.indexSeleccionadoGrilla].codatencion !== body.codatencion) {
        swal.fire(this.globalConstants.msgInfoSummary, 'Cod. Atención diferente al regisrado...!!!','info')
        return;
      }
    }

    this.subscription$ = new Subscription();
    this.subscription$ = this.ventasService.getListRolSalaOperacionPorAtencion(body.codatencion)
    .pipe(
      map((resp: IResultBusquedaSalaOperacionRol[]) => {
          if (resp.length > 0) {

            if (resp[0].estado !== 'A') {
              swal.fire(this.globalConstants.msgInfoSummary, 'Estado de Rol Operación diferente de A','info')
              return;
            }
            
            this.onActualizarRol(resp[0]);
            
          } else {
            swal.fire(this.globalConstants.msgInfoSummary, 'No existe Rol de Operación para la Atención','info')
            return;
          }
        }
      )
    )
    .subscribe(  
    (resp) => {},
    (error) => {
      this.loading = false;
      swal.fire(this.globalConstants.msgErrorSummary, error.error.resultadoDescripcion,'error')
    });
  }

  onActualizarRol(value: IResultBusquedaSalaOperacionRol){

    swal.fire({
      title: 'Actualizar Rol',
      text: "¿Seguro de Actualizar Rol, una vez asignado no se podra modificar...!!!?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'No',
      confirmButtonText: 'Si'
    }).then((result) => {
      if (result.isConfirmed) {

        let body: ISalaOperacionModificarRol = {
          idborrador: this.itemSeleccionadoGrilla.idborrador,
          codrolsala: value.codrolsala,
          codatencion: value.codatencion
        }

        this.isDisplaySave = true;
        this.subscription$ = new Subscription();
        this.subscription$  = this.ventasService.setModificarRolSalaOperacion( body )
        .subscribe(() =>  {
    
          this.isDisplaySave = false;

          this.listModelo[this.indexSeleccionadoGrilla].operacion = value.operacion;
          this.listModelo[this.indexSeleccionadoGrilla].codrolsala = value.codrolsala;
          this.listModelo[this.indexSeleccionadoGrilla].codatencion = value.codatencion;
          this.listModelo[this.indexSeleccionadoGrilla].nombres = value.nombrepaciente;
          this.isDisplaySOP = !this.isDisplaySOP;

          swal.fire(this.globalConstants.msgExitoSummary, this.globalConstants.msgExitoDetail, 'success');
        },
          (error) => {
            this.isDisplaySave = false;
            swal.fire(this.globalConstants.msgErrorSummary,error.error.resultadoDescripcion, 'error');
        });
      }
    })
  }

  onEliminar(){

    if (this.itemSeleccionadoGrilla.flgventa){
      swal.fire(this.globalConstants.msgInfoSummary, 'No se puede eliminar, se encuentra asociado a Vale de Venta','info');
      return;
    }

    let body: ISalaOperacionEliminar = {
      idborrador: this.itemSeleccionadoGrilla.idborrador
    }

    swal.fire({
      title: 'Eliminar Borrador',
      text: "¿Desea Eliminar Borrador?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'No',
      confirmButtonText: 'Si'
    }).then((result) => {
      if (result.isConfirmed) {
        this.isDisplaySave = true;
        this.subscription$ = new Subscription();
        this.subscription$  = this.ventasService.setEliminarSalaOperacion( body )
        .subscribe((resp: any[]) =>  {
    
          this.isDisplaySave = false;
          this.listModelo.splice(+this.indexSeleccionadoGrilla, 1);
          swal.fire(this.globalConstants.msgExitoSummary, this.globalConstants.msgExitoDetail, 'success');
        },
          (error) => {
            this.isDisplaySave = false;
            swal.fire(this.globalConstants.msgErrorSummary,error.error.resultadoDescripcion, 'error');
        });
      }
    })
  }

  goCerrarPreparadoSOP(value: IResultBusquedaSalaOperacion){

    if (value.flgestado){
      swal.fire(this.globalConstants.msgInfoSummary, 'Ya se encuentra Cerrado','info');
      return;
    }

    if (value.flgventa){
      swal.fire(this.globalConstants.msgInfoSummary, 'No se puede eliminar, se encuentra asociado a Vale de Venta','info');
      return;
    }

    let body: ISalaOperacionEliminar = {
      idborrador: value.idborrador
    }

    swal.fire({
      title: 'Cerrar Borrador',
      text: "¿Desea Cerrar Preparado Borrador?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'No',
      confirmButtonText: 'Si'
    }).then((result) => {
      if (result.isConfirmed) {
        this.isDisplaySave = true;
        this.subscription$ = new Subscription();
        this.subscription$  = this.ventasService.setEstadoSalaOperacion( body )
        .subscribe((resp: any[]) =>  {
    
          this.isDisplaySave = false;
          this.listModelo[this.indexSeleccionadoGrilla].flgestado = true;
          swal.fire(this.globalConstants.msgExitoSummary, this.globalConstants.msgExitoDetail, 'success');
        },
          (error) => {
            this.isDisplaySave = false;
            swal.fire(this.globalConstants.msgErrorSummary,error.error.resultadoDescripcion, 'error');
        });
      }
    })
  }

  onGenerarValeVenta() {
    if (!this.itemSeleccionadoGrilla.flgestado){
      swal.fire(this.globalConstants.msgInfoSummary, 'Registro no se encuentra Cerrado','info');
      return;
    }

    if (this.itemSeleccionadoGrilla.flgventa){
      swal.fire(this.globalConstants.msgInfoSummary, 'No se puede Generar, se encuentra asociado a Vale de Venta','info');
      return;
    }
  }

  goNuevo() {
    this.router.navigate(['/main/modulo-ve/sala-operacion-create']);
  }

  ngOnDestroy() {
    if (this.subscription$) {
      this.subscription$.unsubscribe();
    }
  }
}
