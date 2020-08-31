import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToggleSwtichComponent } from './toggle-swtich.component';

describe('ToggleSwtichComponent', () => {
  let component: ToggleSwtichComponent;
  let fixture: ComponentFixture<ToggleSwtichComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToggleSwtichComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToggleSwtichComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
