import { Component, OnInit } from '@angular/core';
import { GlobalsConstantsForm } from '../../../../../constants/globals-constants-form';
import { DemoService } from '../../../../../services/demo.service';

@Component({
  selector: 'app-modal-busqueda-producto',
  templateUrl: './modal-busqueda-producto.component.html',
  styleUrls: ['./modal-busqueda-producto.component.css']
})
export class ModalBusquedaProductoComponent implements OnInit {
  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm();
  listModelo: any[];
  listModeloLote: any[];
  isVisualizar: boolean = false;
  columnas: any;
  columnasLote: any;
  constructor(private demoService: DemoService) { }

  ngOnInit(): void {
    
    this.demoService.getBusquedaProducto().then(alm => this.listModelo = alm);

    this.demoService.getLote().then(alm => this.listModeloLote = alm);

    this.columnas = [
      { field: 'codigo', header: 'Código' },
      { field: 'nombre', header: 'Nombre' },
      { field: 'laboratorio', header: 'Laboratorio' },
      { field: 'precio', header: 'Precio' },
      { field: 'stock', header: 'Stock' }
    ];

    this.columnasLote = [
      { field: 'codigo', header: 'Código' },
      { field: 'nombre', header: 'Nombre' },
      { field: 'ubicacion', header: 'Ubicación' },
      { field: 'fecha', header: 'Fecha Vencimiento' },
      { field: 'stock', header: 'Stock' }
    ];

  }

}
