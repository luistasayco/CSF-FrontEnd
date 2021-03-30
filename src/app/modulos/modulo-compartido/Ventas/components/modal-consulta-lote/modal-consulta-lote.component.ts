import { Component, Input, OnInit } from '@angular/core';
import { DemoService } from '../../../../../services/demo.service';
import { GlobalsConstantsForm } from '../../../../../constants/globals-constants-form';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-modal-consulta-lote',
  templateUrl: './modal-consulta-lote.component.html',
  styleUrls: ['./modal-consulta-lote.component.css']
})
export class ModalConsultaLoteComponent implements OnInit {
  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm();
  @Input() isCodVenta: string;
  @Input() isCodDetalleVenta: string;
  @Input() isCodProducto: string;

  // Lista
  listModelo: any[];
  isVisualizar: boolean = false;
  columnas: any;
  loading: boolean;
  subscription$: Subscription;
  constructor(private demoService: DemoService) { }

  ngOnInit(): void {
    this.demoService.getLote().then(cars => this.listModelo = cars);


    this.columnas = [
      { field: 'codigo', header: 'Lote' },
      { field: 'fecha', header: 'Fecha Vencimiento' },
      { field: 'stock', header: 'Cantidad' }
    ];

  }

}
