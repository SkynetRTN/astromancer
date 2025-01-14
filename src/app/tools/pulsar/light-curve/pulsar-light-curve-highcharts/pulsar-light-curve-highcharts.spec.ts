import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PulsarLightCurveHighchartsComponent} from './pulsar-light-curve-highcharts.component';

describe('PulsarPeriodogramHighchartsComponent', () => {
  let component: PulsarLightCurveHighchartsComponent;
  let fixture: ComponentFixture<PulsarLightCurveHighchartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PulsarLightCurveHighchartsComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PulsarLightCurveHighchartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
