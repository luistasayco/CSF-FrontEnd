import { Component, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { DemoService } from '../../../../../services/demo.service';
import { GlobalsConstantsForm } from '../../../../../constants/globals-constants-form';

@Component({
  selector: 'app-modal-busqueda-venta-por-atencion',
  templateUrl: './modal-busqueda-venta-por-atencion.component.html',
  styleUrls: ['./modal-busqueda-venta-por-atencion.component.css']
})
export class ModalBusquedaVentaPorAtencionComponent implements OnInit {
  listAtencion: TreeNode[];
  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm();
  columnas: any;
  listModelo: any[];
  listModeloProducto: any[];
  constructor(private demoService: DemoService) { }

  ngOnInit(): void {
    this.demoService.getVentaPorAtencion().then(files => this.listAtencion = files);

    this.demoService.getBusquedaProducto().then(files => this.listModeloProducto = files);

    this.columnas = [
      { field: 'codigo', header: 'Código' },
      { field: 'nombre', header: 'Nombre' },
      { field: 'lote', header: 'Lote' },
      // { field: 'ubicacion', header: 'Ubicación' },
      { field: 'cantidad', header: 'Cantidad' },
      { field: 'cantidadDevuelta', header: 'Cantidad Dev.' },
      // { field: 'observacion', header: 'Observación' },
      { field: 'laboratorio', header: 'Laboratorio' }
    ];
  }

}
