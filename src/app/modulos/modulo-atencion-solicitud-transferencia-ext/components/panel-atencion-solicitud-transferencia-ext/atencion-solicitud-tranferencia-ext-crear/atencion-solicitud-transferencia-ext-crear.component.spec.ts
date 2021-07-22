import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AtensionSolicitudTransferenciaExtCrearComponent } from './atencion-solicitud-transferencia-ext-crear.component';

describe('AtensionSolicitudTransferenciaExtCrearComponent', () => {
  let component: AtensionSolicitudTransferenciaExtCrearComponent;
  let fixture: ComponentFixture<AtensionSolicitudTransferenciaExtCrearComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AtensionSolicitudTransferenciaExtCrearComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AtensionSolicitudTransferenciaExtCrearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
