import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmacionSolicitudTransferenciaCrearComponent } from './confirmacion-solicitud-transferencia-crear.component';

describe('ConfirmacionSolicitudTransferenciaCrearComponent', () => {
  let component: ConfirmacionSolicitudTransferenciaCrearComponent;
  let fixture: ComponentFixture<ConfirmacionSolicitudTransferenciaCrearComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmacionSolicitudTransferenciaCrearComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmacionSolicitudTransferenciaCrearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
