import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalBusquedaTipoMotivoNotaCreditoComponent } from './modal-busqueda-tipo-motivo-nota-credito.component';

describe('ModalBusquedaTipoMotivoNotaCreditoComponent', () => {
  let component: ModalBusquedaTipoMotivoNotaCreditoComponent;
  let fixture: ComponentFixture<ModalBusquedaTipoMotivoNotaCreditoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalBusquedaTipoMotivoNotaCreditoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalBusquedaTipoMotivoNotaCreditoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
