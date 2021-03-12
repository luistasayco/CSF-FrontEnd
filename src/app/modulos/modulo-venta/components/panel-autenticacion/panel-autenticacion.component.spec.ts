import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelAutenticacionComponent } from './panel-autenticacion.component';

describe('PanelAutenticacionComponent', () => {
  let component: PanelAutenticacionComponent;
  let fixture: ComponentFixture<PanelAutenticacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PanelAutenticacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelAutenticacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
