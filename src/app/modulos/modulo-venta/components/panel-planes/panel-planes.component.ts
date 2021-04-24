import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { GlobalsConstantsForm } from '../../../../constants/globals-constants-form';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { BreadcrumbService } from '../../../../services/breadcrumb.service';
import { MensajePrimeNgService } from '../../../../services/mensaje-prime-ng.service';
import { VentasService } from '../../services/ventas.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { IMensajeResultadoApi } from '../../../modulo-compartido/Requerimiento/interfaces/mensajeRespuestaApi.interface';
import { PlanesModel } from '../../models/planes.model';

@Component({
  selector: 'app-panel-planes',
  templateUrl: './panel-planes.component.html',
  styleUrls: ['./panel-planes.component.css']
})
export class PanelPlanesComponent implements OnInit {
  // Titulo del componente
  titulo = 'Planes';

  // Name de los botones de accion
  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm();

  // Formulario de Busqueda
  formularioBusqueda: FormGroup;

  // Opcion Buscar
  descripcionFind = '';
  modeloFind: PlanesModel = new PlanesModel() ;
  listModelo: PlanesModel[];

  columnas: any[];
  
  // Opcion Editar
  modelocloned: { [s: string]: any; } = {};

  // Opcion Eliminar
  modeloEliminar: PlanesModel = new PlanesModel() ;

  subscription$: Subscription;
  
  constructor(public readonly mensajePrimeNgService: MensajePrimeNgService,
              private readonly router: Router,
              private readonly fb: FormBuilder,
              private readonly confirmationService: ConfirmationService,
              private readonly breadcrumbService: BreadcrumbService,
              private readonly ventasService: VentasService) {
                this.breadcrumbService.setItems([
                    { label: 'Módulo Ventas' },
                    { label: 'Planes', routerLink: ['module-re/panel-mantenimiento'] }
                ]);
              }

  ngOnInit() {
    this.columnas = [
      { header: 'Codigo' },
      { header: 'Descripcion' },
      { header: 'Descuento' },
      { header: 'Estado' }
    ];

    this.onbuildForm();

    this.onListar();
  }

  private onbuildForm() {
    this.formularioBusqueda = this.fb.group({
      nombre: [''],
    });
  }

  onToBuscar() {
    this.onListar();
  }

  onListar() {
    const formBody = this.formularioBusqueda.value;
    this.modeloFind = {nombre: formBody.nombre};
    this.subscription$ = new Subscription();
    this.subscription$ = this.ventasService.getPlanesGetByFiltros(this.modeloFind)
    .subscribe(resp => {
      if (resp) {
          this.listModelo = resp;
        }
      },
      (error) => {
        this.mensajePrimeNgService.onToErrorMsg(error.error);
      }
    );
  }

  onRowEditInit(modelo: PlanesModel) {
    this.modelocloned[modelo.idPlan] = {...modelo};
  }

  onRowEditSave(modelo: PlanesModel) {
    this.subscription$ = new Subscription();
    this.subscription$ = this.ventasService.setPlanesModificar(modelo)
    .subscribe((resp: IMensajeResultadoApi) => {
      delete this.modelocloned[modelo.idPlan];
      console.log('resp', resp);
      this.mensajePrimeNgService.onToExitoMsg(null, resp);
    },
      (error) => {
        this.mensajePrimeNgService.onToErrorMsg(null, error.error);
      });
  }

  onRowEditCancel(modelo: PlanesModel, index: number) {
    this.listModelo[index] = this.modelocloned[modelo.idPlan];
    delete this.modelocloned[modelo.idPlan];
  }

  onToRowSelectDelete(modelo: PlanesModel) {
    this.modeloEliminar = modelo;
    this.onConfirmDelete();
  }

  onToCreate() {
    this.router.navigate(['/main/modulo-ve/planes-create']);
  }

  onConfirmDelete() {
    this.confirmationService.confirm({
        message: this.globalConstants.subTitleEliminar,
        header: this.globalConstants.titleEliminar,
        icon: 'pi pi-info-circle',
        acceptLabel: 'Si',
        rejectLabel: 'No',
        accept: () => {
          this.onToDelete();
        },
        reject: () => {
          this.mensajePrimeNgService.onToCancelMsg(this.globalConstants.msgCancelSummary, this.globalConstants.msgCancelDetail);
        }
    });
  }

  onToDelete() {
    this.subscription$ = new Subscription();
    this.subscription$ = this.ventasService.setPlanesEliminar(this.modeloEliminar)
    .subscribe((resp: IMensajeResultadoApi) => {
      this.listModelo = this.listModelo.filter(datafilter => datafilter.idPlan !== this.modeloEliminar.idPlan );
      console.log('object', resp);
      this.mensajePrimeNgService.onToExitoMsg(null, resp);
    },
      (error) => {
        this.mensajePrimeNgService.onToErrorMsg(null, error.error);
      });
  }

  ngOnDestroy() {
    if (this.subscription$) {
      this.subscription$.unsubscribe();
    }
  }

}
