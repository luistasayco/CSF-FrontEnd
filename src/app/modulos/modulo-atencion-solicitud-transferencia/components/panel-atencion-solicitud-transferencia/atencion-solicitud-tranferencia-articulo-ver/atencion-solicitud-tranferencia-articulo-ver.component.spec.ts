import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AtencionSolicitudTrasladoArticuloVerComponent } from './atencion-solicitud-tranferencia-articulo-ver.component';

describe('AtencionSolicitudTrasladoArticuloVerComponent', () => {
  let component: AtencionSolicitudTrasladoArticuloVerComponent;
  let fixture: ComponentFixture<AtencionSolicitudTrasladoArticuloVerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AtencionSolicitudTrasladoArticuloVerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AtencionSolicitudTrasladoArticuloVerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
