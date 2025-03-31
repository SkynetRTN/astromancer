import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultSummaryComponent } from './result-summary.component';

describe('ResultSummaryComponent', () => {
  let component: ResultSummaryComponent;
  let fixture: ComponentFixture<ResultSummaryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResultSummaryComponent]
    });
    fixture = TestBed.createComponent(ResultSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
