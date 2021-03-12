import { Component, OnInit } from '@angular/core';
import { GlobalsConstantsForm } from '../../../../../constants/globals-constants-form';

@Component({
  selector: 'app-modal-busqueda-nota-credito-devolucion',
  templateUrl: './modal-busqueda-nota-credito-devolucion.component.html',
  styleUrls: ['./modal-busqueda-nota-credito-devolucion.component.css']
})
export class ModalBusquedaNotaCreditoDevolucionComponent implements OnInit {
  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm();
  constructor() { }

  ngOnInit(): void {
  }

}
