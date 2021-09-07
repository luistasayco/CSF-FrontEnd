import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalHojaDatosComponent } from './modal-hoja-datos.component';

describe('ModalHojaDatosComponent', () => {
  let component: ModalHojaDatosComponent;
  let fixture: ComponentFixture<ModalHojaDatosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalHojaDatosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalHojaDatosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
