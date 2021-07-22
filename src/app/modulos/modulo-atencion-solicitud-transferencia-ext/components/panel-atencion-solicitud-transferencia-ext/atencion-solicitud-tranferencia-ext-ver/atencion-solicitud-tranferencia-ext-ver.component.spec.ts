import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AtencionSolicitudTraslaExtVerComponent } from './atencion-solicitud-tranferencia-ext-ver.component';

describe('AtencionSolicitudTraslaExtVerComponent', () => {
  let component: AtencionSolicitudTraslaExtVerComponent;
  let fixture: ComponentFixture<AtencionSolicitudTraslaExtVerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AtencionSolicitudTraslaExtVerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AtencionSolicitudTraslaExtVerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
