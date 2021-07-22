import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelAtensionSolicitudTransferenciaExtComponent } from '../panel-atencion-solicitud-transferencia-ext/panel-atencion-solicitud-transferencia-ext.component';

describe('PanelAtensionSolicitudTransferenciaExtComponent', () => {
  let component: PanelAtensionSolicitudTransferenciaExtComponent;
  let fixture: ComponentFixture<PanelAtensionSolicitudTransferenciaExtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PanelAtensionSolicitudTransferenciaExtComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelAtensionSolicitudTransferenciaExtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
