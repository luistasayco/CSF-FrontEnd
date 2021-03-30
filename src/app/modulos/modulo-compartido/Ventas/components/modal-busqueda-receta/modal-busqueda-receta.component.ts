import { Component, Input, OnInit } from '@angular/core';
import { GlobalsConstantsForm } from '../../../../../constants/globals-constants-form';
import { DemoService } from '../../../../../services/demo.service';
import { LanguageService } from '../../../../../services/language.service';

@Component({
  selector: 'app-modal-busqueda-receta',
  templateUrl: './modal-busqueda-receta.component.html',
  styleUrls: ['./modal-busqueda-receta.component.css']
})
export class ModalBusquedaRecetaComponent implements OnInit {
  
  @Input() append: any;

  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm();
  isVisualizar: boolean = false;
  columnas: any;
  listModelo: any[];

  isVisualizarObservacion: boolean;
  isAtencionObservacion: string;

  constructor(private demoService: DemoService,
              public lenguageService: LanguageService) { }

  ngOnInit(): void {
    this.demoService.getReceta().then(alm => this.listModelo = alm);

    this.columnas = [
      { field: 'receta', header: 'Receta' },
      { field: 'atencion', header: 'Atención' },
      { field: 'fecha', header: 'Fecha' },
      { field: 'paciente', header: 'Paciente' },
      { field: 'telefono', header: 'Telefono' },
      { field: 'nombreMedico', header: 'Medido' },
      { field: 'tipoConsumo', header: 'Tip. Cons. Med.' }
    ];
  }

  goVisualizarObservacion(atencion: string) {
    this.isVisualizarObservacion = !this.isVisualizarObservacion;
    this.isAtencionObservacion = atencion;
  }
}
