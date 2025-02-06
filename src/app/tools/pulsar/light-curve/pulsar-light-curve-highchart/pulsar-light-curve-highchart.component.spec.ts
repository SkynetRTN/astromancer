import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PulsarLightCurveHighchartComponent} from './pulsar-light-curve-highchart.component';

describe('PulsarLightCurveHighchartComponent', () => {
  let component: PulsarLightCurveHighchartComponent;
  let fixture: ComponentFixture<PulsarLightCurveHighchartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PulsarLightCurveHighchartComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PulsarLightCurveHighchartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
