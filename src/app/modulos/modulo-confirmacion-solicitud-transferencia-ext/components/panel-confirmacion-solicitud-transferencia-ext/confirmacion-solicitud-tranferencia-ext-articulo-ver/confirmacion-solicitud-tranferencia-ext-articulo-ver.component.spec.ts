import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmacionSolicitudTrasladoExtArticuloVerComponent } from './confirmacion-solicitud-tranferencia-ext-articulo-ver.component';

describe('ConfirmacionSolicitudTrasladoExtArticuloVerComponent', () => {
  let component: ConfirmacionSolicitudTrasladoExtArticuloVerComponent;
  let fixture: ComponentFixture<ConfirmacionSolicitudTrasladoExtArticuloVerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmacionSolicitudTrasladoExtArticuloVerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmacionSolicitudTrasladoExtArticuloVerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
