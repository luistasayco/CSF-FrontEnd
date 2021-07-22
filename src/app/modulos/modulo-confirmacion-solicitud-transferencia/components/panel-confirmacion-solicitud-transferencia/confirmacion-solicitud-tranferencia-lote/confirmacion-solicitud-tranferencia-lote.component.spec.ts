import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {ConfirmacionSolicitudTransferenciaLoteComponent } from './confirmacion-solicitud-tranferencia-lote.component'

describe('ConfirmacionSolicitudTransferenciaLoteComponent', () => {
  let component: ConfirmacionSolicitudTransferenciaLoteComponent;
  let fixture: ComponentFixture<ConfirmacionSolicitudTransferenciaLoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmacionSolicitudTransferenciaLoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmacionSolicitudTransferenciaLoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
