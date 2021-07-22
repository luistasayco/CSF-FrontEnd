import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmacionSolicitudTraslaVerComponent } from './confirmacion-solicitud-tranferencia-ver.component';

describe('ConfirmacionSolicitudTraslaVerComponent', () => {
  let component: ConfirmacionSolicitudTraslaVerComponent;
  let fixture: ComponentFixture<ConfirmacionSolicitudTraslaVerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmacionSolicitudTraslaVerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmacionSolicitudTraslaVerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
