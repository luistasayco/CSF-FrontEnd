import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AtencionSolicitudTrasladoExtArticuloVerComponent } from './atencion-solicitud-tranferencia-ext-articulo-ver.component';

describe('AtencionSolicitudTrasladoExtArticuloVerComponent', () => {
  let component: AtencionSolicitudTrasladoExtArticuloVerComponent;
  let fixture: ComponentFixture<AtencionSolicitudTrasladoExtArticuloVerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AtencionSolicitudTrasladoExtArticuloVerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AtencionSolicitudTrasladoExtArticuloVerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
