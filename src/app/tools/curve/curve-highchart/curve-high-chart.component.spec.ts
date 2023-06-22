import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CurveHighChartComponent} from './curve-high-chart.component';

describe('CurveHighchartComponent', () => {
  let component: CurveHighChartComponent;
  let fixture: ComponentFixture<CurveHighChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CurveHighChartComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CurveHighChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
