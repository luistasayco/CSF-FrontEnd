import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalBusquedaPisoComponent } from './modal-busqueda-piso.component';

describe('ModalBusquedaPisoComponent', () => {
  let component: ModalBusquedaPisoComponent;
  let fixture: ComponentFixture<ModalBusquedaPisoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalBusquedaPisoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalBusquedaPisoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
