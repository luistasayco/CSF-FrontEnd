import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-panel-autenticacion',
  templateUrl: './panel-autenticacion.component.html',
  styleUrls: ['./panel-autenticacion.component.css']
})
export class PanelAutenticacionComponent implements OnInit {

  @Input() isAnular: boolean;

  constructor() { }

  ngOnInit(): void {
  }

}
