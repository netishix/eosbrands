import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalWtfComponent } from './modal-wtf.component';

describe('ModalWtfComponent', () => {
  let component: ModalWtfComponent;
  let fixture: ComponentFixture<ModalWtfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalWtfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalWtfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
