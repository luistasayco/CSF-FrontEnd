import { Component, Input, OnInit } from '@angular/core';
import { GlobalsConstantsForm } from '../../../../../constants/globals-constants-form';
import { DemoService } from '../../../../../services/demo.service';
import { LanguageService } from '../../../../../services/language.service';

@Component({
  selector: 'app-modal-busqueda-generico',
  templateUrl: './modal-busqueda-generico.component.html',
  styleUrls: ['./modal-busqueda-generico.component.css']
})
export class ModalBusquedaGenericoComponent implements OnInit {
  
  @Input() append: any;

  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm();
  isVisualizar: boolean = false;
  columnas: any;
  listModelo: any[];
  constructor(private demoService: DemoService,
              public lenguageService: LanguageService) { }

  ngOnInit(): void {
    this.demoService.getBusquedaProducto().then(alm => this.listModelo = alm);

    this.columnas = [
      { field: 'codigo', header: 'Código' },
      { field: 'nombre', header: 'Nombre' },
      { field: 'laboratorio', header: 'Laboratorio' },
      { field: 'precio', header: 'Precio' },
      { field: 'stock', header: 'Stock' },
      { field: 'stock', header: 'Stock Alm. Central' }
    ];
  }
}
