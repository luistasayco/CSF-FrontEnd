import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { GlobalsConstantsForm } from '../../../../../constants/globals-constants-form';
import { DemoService } from '../../../../../services/demo.service';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-modal-receta-observacion',
  templateUrl: './modal-receta-observacion.component.html',
  styleUrls: ['./modal-receta-observacion.component.css']
})
export class ModalRecetaObservacionComponent implements OnInit, OnChanges   {
  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm();
  
  @Input() isVisualizar: boolean = false;
  @Input() isAtencion: string;

  isVisualizarMantenimientoObservacion: boolean

  formularioBusqueda: FormGroup;
  columnas: any;
  listModelo: any[];
  constructor(private demoService: DemoService,
              private readonly fb: FormBuilder) { }

  ngOnInit(): void {

    this.buildForm();
    this.buildColumnas();
    this.demoService.getRecetaObservacion().then(alm => this.listModelo = alm); 
  }

  private buildForm() {
    this.formularioBusqueda = this.fb.group({
      atencion: [{value: null, disabled: true}],
    });
  }

  ngOnChanges() {
    if (this.isVisualizar) {
      this.formularioBusqueda.controls.atencion.setValue(this.isAtencion);
    }
  }

  private buildColumnas() {
    this.columnas = [
      { field: 'id', header: 'Id' },
      { field: 'receta', header: 'Receta' },
      { field: 'fecha', header: 'Fecha Registro' },
      { field: 'usuario', header: 'Usuario' },
      { field: 'comentario', header: 'Comentario' },
      { field: 'fechaAnulacion', header: 'Fecha Anulación' }
    ];
  }
}
