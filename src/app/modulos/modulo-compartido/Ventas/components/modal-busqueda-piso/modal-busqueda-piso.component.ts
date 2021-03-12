import { Component, OnInit } from '@angular/core';
import { GlobalsConstantsForm } from '../../../../../constants/globals-constants-form';

@Component({
  selector: 'app-modal-busqueda-piso',
  templateUrl: './modal-busqueda-piso.component.html',
  styleUrls: ['./modal-busqueda-piso.component.css']
})
export class ModalBusquedaPisoComponent implements OnInit {
  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm();
  constructor() { }

  ngOnInit(): void {
  }

}
