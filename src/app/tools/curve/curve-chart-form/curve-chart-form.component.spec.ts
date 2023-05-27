import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CurveChartFormComponent} from './curve-chart-form.component';

describe('CurveChartFormComponent', () => {
  let component: CurveChartFormComponent;
  let fixture: ComponentFixture<CurveChartFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CurveChartFormComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CurveChartFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
