import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalStatsCardsComponent } from './global-stats-cards.component';

describe('GlobalStatsCardsComponent', () => {
  let component: GlobalStatsCardsComponent;
  let fixture: ComponentFixture<GlobalStatsCardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GlobalStatsCardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalStatsCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
