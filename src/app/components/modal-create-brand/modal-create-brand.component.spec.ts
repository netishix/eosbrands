import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCreateBrandComponent } from './modal-create-brand.component';

describe('ModalCreateBrandComponent', () => {
  let component: ModalCreateBrandComponent;
  let fixture: ComponentFixture<ModalCreateBrandComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalCreateBrandComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCreateBrandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
