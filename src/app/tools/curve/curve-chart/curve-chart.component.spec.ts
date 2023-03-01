import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurveChartComponent } from './curve-chart.component';

describe('CurveChartComponent', () => {
  let component: CurveChartComponent;
  let fixture: ComponentFixture<CurveChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurveChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurveChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
