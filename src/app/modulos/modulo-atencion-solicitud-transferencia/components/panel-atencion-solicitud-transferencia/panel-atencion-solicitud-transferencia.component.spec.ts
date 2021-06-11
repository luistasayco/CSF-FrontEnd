import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelAtensionSolicitudTransferenciaComponent } from '../panel-atencion-solicitud-transferencia/panel-atencion-solicitud-transferencia.component';

describe('PanelAtensionSolicitudTransferenciaComponent', () => {
  let component: PanelAtensionSolicitudTransferenciaComponent;
  let fixture: ComponentFixture<PanelAtensionSolicitudTransferenciaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PanelAtensionSolicitudTransferenciaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelAtensionSolicitudTransferenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
