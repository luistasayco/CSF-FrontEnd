import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelConfirmacionSolicitudTransferenciaExtComponent } from '../panel-confirmacion-solicitud-transferencia-ext/panel-confirmacion-solicitud-transferencia-ext.component';

describe('PanelConfirmacionSolicitudTransferenciaExtComponent', () => {
  let component: PanelConfirmacionSolicitudTransferenciaExtComponent;
  let fixture: ComponentFixture<PanelConfirmacionSolicitudTransferenciaExtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PanelConfirmacionSolicitudTransferenciaExtComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelConfirmacionSolicitudTransferenciaExtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
