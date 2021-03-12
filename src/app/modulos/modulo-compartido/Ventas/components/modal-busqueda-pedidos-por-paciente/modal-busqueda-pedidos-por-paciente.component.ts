import { Component, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { GlobalsConstantsForm } from '../../../../../constants/globals-constants-form';
import { DemoService } from '../../../../../services/demo.service';

@Component({
  selector: 'app-modal-busqueda-pedidos-por-paciente',
  templateUrl: './modal-busqueda-pedidos-por-paciente.component.html',
  styleUrls: ['./modal-busqueda-pedidos-por-paciente.component.css']
})
export class ModalBusquedaPedidosPorPacienteComponent implements OnInit {
  listAtencion: TreeNode[];
  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm();
  columnas: any;
  listModelo: any[];
  listModeloProducto: any[];
  constructor(private demoService: DemoService) { }

  ngOnInit(): void {
    this.demoService.getPedidoPorAtencion().then(files => this.listAtencion = files);

    this.demoService.getBusquedaProducto().then(files => this.listModeloProducto = files);

    this.columnas = [
      { field: 'codigo', header: 'Código' },
      { field: 'tipoProducto', header: 'Tipo' },
      { field: 'nombre', header: 'Nombre' },
      { field: 'lote', header: 'Lote' },
      { field: 'ubicacion', header: 'Ubicación' },
      { field: 'cantidad', header: 'Cantidad' },
      { field: 'laboratorio', header: 'Laboratorio' }
    ];
  }
}
