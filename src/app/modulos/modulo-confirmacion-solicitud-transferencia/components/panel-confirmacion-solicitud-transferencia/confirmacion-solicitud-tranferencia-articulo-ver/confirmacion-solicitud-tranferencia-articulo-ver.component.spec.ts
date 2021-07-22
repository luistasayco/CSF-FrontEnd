import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmacionSolicitudTrasladoArticuloVerComponent } from './confirmacion-solicitud-tranferencia-articulo-ver.component';

describe('ConfirmacionSolicitudTrasladoArticuloVerComponent', () => {
  let component: ConfirmacionSolicitudTrasladoArticuloVerComponent;
  let fixture: ComponentFixture<ConfirmacionSolicitudTrasladoArticuloVerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmacionSolicitudTrasladoArticuloVerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmacionSolicitudTrasladoArticuloVerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
