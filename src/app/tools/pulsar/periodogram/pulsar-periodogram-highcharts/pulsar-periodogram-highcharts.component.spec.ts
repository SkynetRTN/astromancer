import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PulsarPeriodogramHighchartsComponent} from './pulsar-periodogram-highcharts.component';

describe('PulsarPeriodogramHighchartsComponent', () => {
  let component: PulsarPeriodogramHighchartsComponent;
  let fixture: ComponentFixture<PulsarPeriodogramHighchartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PulsarPeriodogramHighchartsComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PulsarPeriodogramHighchartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
