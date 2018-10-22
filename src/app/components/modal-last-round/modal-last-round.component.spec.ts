import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalLastRoundComponent } from './modal-last-round.component';

describe('ModalLastRoundComponent', () => {
  let component: ModalLastRoundComponent;
  let fixture: ComponentFixture<ModalLastRoundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalLastRoundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalLastRoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
