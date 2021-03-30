import { Component, Input, OnInit } from '@angular/core';
import { GlobalsConstantsForm } from '../../../../../constants/globals-constants-form';

@Component({
  selector: 'app-modal-consulta-producto',
  templateUrl: './modal-consulta-producto.component.html',
  styleUrls: ['./modal-consulta-producto.component.css']
})
export class ModalConsultaProductoComponent implements OnInit {
  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm();
  @Input() isCodProducto: string;

  isVisualizar: boolean;
  constructor() { }

  ngOnInit(): void {
  }

  goChangeVisibleRegistro() {
    this.isVisualizar =!this.isVisualizar; 
  }

}
