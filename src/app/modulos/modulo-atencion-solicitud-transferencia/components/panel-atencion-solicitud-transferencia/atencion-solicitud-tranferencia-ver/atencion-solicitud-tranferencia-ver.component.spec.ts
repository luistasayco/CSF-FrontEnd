import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AtencionSolicitudTraslaVerComponent } from './atencion-solicitud-tranferencia-ver.component';

describe('AtencionSolicitudTraslaVerComponent', () => {
  let component: AtencionSolicitudTraslaVerComponent;
  let fixture: ComponentFixture<AtencionSolicitudTraslaVerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AtencionSolicitudTraslaVerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AtencionSolicitudTraslaVerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
