import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PulsarLightCurveChartFormComponent} from './pulsar-light-curve-chart-form.component';

describe('PulsarLightCurveChartFormComponent', () => {
  let component: PulsarLightCurveChartFormComponent;
  let fixture: ComponentFixture<PulsarLightCurveChartFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PulsarLightCurveChartFormComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PulsarLightCurveChartFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
