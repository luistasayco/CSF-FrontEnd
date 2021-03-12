import { Component, OnInit } from '@angular/core';
import { GlobalsConstantsForm } from '../../../../../constants/globals-constants-form';

@Component({
  selector: 'app-modal-busqueda-tipo-motivo-nota-credito',
  templateUrl: './modal-busqueda-tipo-motivo-nota-credito.component.html',
  styleUrls: ['./modal-busqueda-tipo-motivo-nota-credito.component.css']
})
export class ModalBusquedaTipoMotivoNotaCreditoComponent implements OnInit {
  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm();
  constructor() { }

  ngOnInit(): void {
  }

}
