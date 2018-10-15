import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalLeaderboardComponent } from './modal-leaderboard.component';

describe('ModalLeaderboardComponent', () => {
  let component: ModalLeaderboardComponent;
  let fixture: ComponentFixture<ModalLeaderboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalLeaderboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalLeaderboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
