import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalLastBuyersComponent } from './modal-last-buyers.component';

describe('ModalLastBuyersComponent', () => {
  let component: ModalLastBuyersComponent;
  let fixture: ComponentFixture<ModalLastBuyersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalLastBuyersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalLastBuyersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
