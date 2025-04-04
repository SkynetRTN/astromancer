import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PulsarPeriodFoldingHighchartComponent} from './pulsar-period-folding-highchart.component';

describe('PulsarPeriodFoldingHighchartComponent', () => {
  let component: PulsarPeriodFoldingHighchartComponent;
  let fixture: ComponentFixture<PulsarPeriodFoldingHighchartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PulsarPeriodFoldingHighchartComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PulsarPeriodFoldingHighchartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
