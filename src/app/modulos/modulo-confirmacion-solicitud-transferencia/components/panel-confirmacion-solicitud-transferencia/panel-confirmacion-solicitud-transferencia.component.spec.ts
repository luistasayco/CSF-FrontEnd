import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelConfirmacionSolicitudTransferenciaComponent } from '../panel-confirmacion-solicitud-transferencia/panel-confirmacion-solicitud-transferencia.component';

describe('PanelConfirmacionSolicitudTransferenciaComponent', () => {
  let component: PanelConfirmacionSolicitudTransferenciaComponent;
  let fixture: ComponentFixture<PanelConfirmacionSolicitudTransferenciaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PanelConfirmacionSolicitudTransferenciaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelConfirmacionSolicitudTransferenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
