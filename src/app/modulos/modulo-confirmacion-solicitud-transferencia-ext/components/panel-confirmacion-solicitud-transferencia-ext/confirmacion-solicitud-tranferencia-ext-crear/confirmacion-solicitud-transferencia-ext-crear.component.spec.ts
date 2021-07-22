import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmacionSolicitudTransferenciaExtCrearComponent } from './confirmacion-solicitud-transferencia-ext-crear.component';

describe('ConfirmacionSolicitudTransferenciaExtCrearComponent', () => {
  let component: ConfirmacionSolicitudTransferenciaExtCrearComponent;
  let fixture: ComponentFixture<ConfirmacionSolicitudTransferenciaExtCrearComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmacionSolicitudTransferenciaExtCrearComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmacionSolicitudTransferenciaExtCrearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
