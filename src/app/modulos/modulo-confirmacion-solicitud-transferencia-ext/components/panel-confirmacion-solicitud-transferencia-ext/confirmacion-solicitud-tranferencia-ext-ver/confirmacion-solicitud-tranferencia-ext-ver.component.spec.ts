import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmacionSolicitudTraslaExtVerComponent } from './confirmacion-solicitud-tranferencia-ext-ver.component';

describe('ConfirmacionSolicitudTraslaExtVerComponent', () => {
  let component: ConfirmacionSolicitudTraslaExtVerComponent;
  let fixture: ComponentFixture<ConfirmacionSolicitudTraslaExtVerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmacionSolicitudTraslaExtVerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmacionSolicitudTraslaExtVerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
