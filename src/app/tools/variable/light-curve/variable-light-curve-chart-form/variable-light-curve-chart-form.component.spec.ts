import {ComponentFixture, TestBed} from '@angular/core/testing';

import {VariableLightCurveChartFormComponent} from './variable-light-curve-chart-form.component';

describe('VariableLightCurveChartFormComponent', () => {
  let component: VariableLightCurveChartFormComponent;
  let fixture: ComponentFixture<VariableLightCurveChartFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VariableLightCurveChartFormComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(VariableLightCurveChartFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
