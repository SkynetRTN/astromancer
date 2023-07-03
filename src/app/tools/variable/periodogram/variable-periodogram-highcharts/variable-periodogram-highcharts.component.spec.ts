import {ComponentFixture, TestBed} from '@angular/core/testing';

import {VariablePeriodogramHighchartsComponent} from './variable-periodogram-highcharts.component';

describe('VariablePeriodogramHighchartsComponent', () => {
  let component: VariablePeriodogramHighchartsComponent;
  let fixture: ComponentFixture<VariablePeriodogramHighchartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VariablePeriodogramHighchartsComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(VariablePeriodogramHighchartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
