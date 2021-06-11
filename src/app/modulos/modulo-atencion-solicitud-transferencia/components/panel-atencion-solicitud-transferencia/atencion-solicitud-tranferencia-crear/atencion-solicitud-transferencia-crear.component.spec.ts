import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AtensionSolicitudTransferenciaCrearComponent } from './atencion-solicitud-transferencia-crear.component';

describe('AtensionSolicitudTransferenciaCrearComponent', () => {
  let component: AtensionSolicitudTransferenciaCrearComponent;
  let fixture: ComponentFixture<AtensionSolicitudTransferenciaCrearComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AtensionSolicitudTransferenciaCrearComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AtensionSolicitudTransferenciaCrearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
