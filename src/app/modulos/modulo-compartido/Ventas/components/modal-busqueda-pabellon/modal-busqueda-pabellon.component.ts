import { Component, OnInit } from '@angular/core';
import { GlobalsConstantsForm } from '../../../../../constants/globals-constants-form';

@Component({
  selector: 'app-modal-busqueda-pabellon',
  templateUrl: './modal-busqueda-pabellon.component.html',
  styleUrls: ['./modal-busqueda-pabellon.component.css']
})
export class ModalBusquedaPabellonComponent implements OnInit {
  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm();
  constructor() { }

  ngOnInit(): void {
  }

}
