import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {AtencionSolicitudTransferenciaExtLoteComponent } from './atencion-solicitud-tranferencia-ext-lote.component'

describe('AtencionSolicitudTransferenciaExtLoteComponent', () => {
  let component: AtencionSolicitudTransferenciaExtLoteComponent;
  let fixture: ComponentFixture<AtencionSolicitudTransferenciaExtLoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AtencionSolicitudTransferenciaExtLoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AtencionSolicitudTransferenciaExtLoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
