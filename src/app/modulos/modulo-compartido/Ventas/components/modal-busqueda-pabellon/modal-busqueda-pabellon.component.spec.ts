import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalBusquedaPabellonComponent } from './modal-busqueda-pabellon.component';

describe('ModalBusquedaPabellonComponent', () => {
  let component: ModalBusquedaPabellonComponent;
  let fixture: ComponentFixture<ModalBusquedaPabellonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalBusquedaPabellonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalBusquedaPabellonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
