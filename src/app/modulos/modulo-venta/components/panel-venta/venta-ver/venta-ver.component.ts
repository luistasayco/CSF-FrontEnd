import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GlobalsConstantsForm } from '../../../../../constants/globals-constants-form';
import { BreadcrumbService } from '../../../../../services/breadcrumb.service';
import { LanguageService } from '../../../../../services/language.service';
import { IVentaCabeceraSingle } from '../../../interface/venta.interface';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-venta-ver',
  templateUrl: './venta-ver.component.html',
  styleUrls: ['./venta-ver.component.css']
})
export class VentaVerComponent implements OnInit {
  // Titulo del componente
  titulo = 'Consulta Ventas';
  
  @Input() isVisibleAnular: boolean 
  // Venta
  @Input() modeloItem: IVentaCabeceraSingle;
  @Output() eventoCerrar = new EventEmitter();
  // Name de los botones de accion
  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm;

  // Formulario
  formularioCabecera: FormGroup;

  columnas: any;

  isVerModalDetalle: boolean
  constructor(private breadcrumbService: BreadcrumbService,
              public lenguageService: LanguageService,
              private readonly fb: FormBuilder) {     
    this.breadcrumbService.setItems([
      { label: 'Módulo Venta' },
      { label: 'Venta', routerLink: ['module-ve/venta-create'] }
    ]);
  }

  ngOnInit(): void {
    this.buildColumnas();
    this.buildForm();
    this.buildFormSetValue();
  }

  private buildForm() {
    this.formularioCabecera = this.fb.group({
      codventa: [{value: null, disabled: true}],
      tipomovimiento: [{value: null, disabled: true}],
      codcomprobante: [{value: null, disabled: true}],
      codpresotor: [{value: null, disabled: true}],
      nombrealmacen: [{value: null, disabled: true}],
      fechagenera: [{value: null, disabled: true}],
      observacion: [{value: null, disabled: true}],
      montodctoplan: [{value: null, disabled: true}],
      montototal: [{value: null, disabled: true}],
      montopaciente: [{value: null, disabled: true}],
      montoaseguradora: [{value: null, disabled: true}],
      montoigv: [{value: null, disabled: true}],
      montoneto: [{value: null, disabled: true}],
      tienedevolucion: [{value: false, disabled: true}],
      moneda: [{value: false, disabled: true}],
      flggratuito: [{value: false, disabled: true}]
    });
  }

  private buildFormSetValue() {
      this.formularioCabecera.controls.codventa.setValue(this.modeloItem.codventa);
      this.formularioCabecera.controls.tipomovimiento.setValue(this.modeloItem.tipomovimiento);
      this.formularioCabecera.controls.codcomprobante.setValue(this.modeloItem.codcomprobante);
      this.formularioCabecera.controls.codpresotor.setValue(this.modeloItem.codpresotor);
      this.formularioCabecera.controls.nombrealmacen.setValue(this.modeloItem.nombrealmacen);
      this.formularioCabecera.controls.fechagenera.setValue(new Date(this.modeloItem.fechagenera));
      this.formularioCabecera.controls.observacion.setValue(this.modeloItem.observacion);

      this.formularioCabecera.controls.montodctoplan.setValue(this.modeloItem.montodctoplan);

      this.formularioCabecera.controls.montototal.setValue(this.modeloItem.montototal);
      this.formularioCabecera.controls.montopaciente.setValue(this.modeloItem.montopaciente);
      this.formularioCabecera.controls.montoaseguradora.setValue(this.modeloItem.montoaseguradora);

      this.formularioCabecera.controls.montoigv.setValue(this.modeloItem.montoigv);
      this.formularioCabecera.controls.montoneto.setValue(this.modeloItem.montoneto);
      this.formularioCabecera.controls.tienedevolucion.setValue(this.modeloItem.tienedevolucion);
      this.formularioCabecera.controls.moneda.setValue(this.modeloItem.moneda === "S" ? true: false);
      this.formularioCabecera.controls.flggratuito.setValue(this.modeloItem.flg_gratuito);
  }

  private buildColumnas() {
    this.columnas = [
      { field: 'codproducto', header: 'Cod. Prod.' },
      { field: 'lote', header: 'Lote' },
      { field: 'nombreproducto', header: 'Descripción' },
      { field: 'cantidad_fraccion', header: 'Cantidad' },
      { field: 'precioventaPVP', header: 'PVP' },
      { field: 'porcentajedctoproducto', header: 'Dscto.Prd.' },
      { field: 'porcentajedctoplan', header: 'Dscto.Plan' },
      { field: 'montototal', header: 'Total' },
      { field: 'montopaciente', header: 'Monto Pac.' },
      { field: 'montoaseguradora', header: 'Monto Aseg.' },
      { field: 'valorVVP', header: 'VVP' },
    ];
  }

  goCerrar() {
    this.eventoCerrar.emit();
  }

  getAnular() {
    this.isVerModalDetalle = !this.isVerModalDetalle;
  }
}
