import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ScatterChartFormComponent} from './scatter-chart-form.component';

describe('ScatterChartFormComponent', () => {
  let component: ScatterChartFormComponent;
  let fixture: ComponentFixture<ScatterChartFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ScatterChartFormComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ScatterChartFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
