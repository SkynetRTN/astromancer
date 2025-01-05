import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PulsarPeriodFoldingHighchartsComponent} from './pulsar-period-folding-highcharts.component';

describe('PulsarPeriodFoldingHighchartsComponent', () => {
  let component: PulsarPeriodFoldingHighchartsComponent;
  let fixture: ComponentFixture<PulsarPeriodFoldingHighchartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PulsarPeriodFoldingHighchartsComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PulsarPeriodFoldingHighchartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
