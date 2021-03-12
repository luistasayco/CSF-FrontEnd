import { Component, Input, OnInit } from '@angular/core';
import { GlobalsConstantsForm } from '../../../../../constants/globals-constants-form';
import { DemoService } from '../../../../../services/demo.service';
import { LanguageService } from '../../../../../services/language.service';

@Component({
  selector: 'app-modal-busqueda-pedido',
  templateUrl: './modal-busqueda-pedido.component.html',
  styleUrls: ['./modal-busqueda-pedido.component.css']
})
export class ModalBusquedaPedidoComponent implements OnInit {
  
  @Input() append: any;

  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm();
  isVisualizar: boolean = false;
  columnas: any;
  listModelo: any[];
  constructor(private demoService: DemoService,
              public lenguageService: LanguageService) { }

  ngOnInit(): void {
    this.demoService.getPedido().then(alm => this.listModelo = alm);

    this.columnas = [
      { field: 'estado', header: 'Estado' },
      { field: 'codVenta', header: 'codVenta' },
      { field: 'codPedido', header: 'codPedido' },
      { field: 'codAtencion', header: 'codAtencion' },
      { field: 'fechaGenerado', header: 'Fec. Genera' },
      { field: 'fechaAtencion', header: 'Fec. Atención' },
      { field: 'cama', header: 'Cama' },
      { field: 'centroCosto', header: 'Centro Costo' },
      { field: 'observacion', header: 'Observación' },
      { field: 'usuario', header: 'Usuario' },
      { field: 'almacen', header: 'Almacen' }
    ];
  }

}
