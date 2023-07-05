import {ComponentFixture, TestBed} from '@angular/core/testing';

import {VariablePeriodFoldingHighchartComponent} from './variable-period-folding-highchart.component';

describe('VariablePeriodFoldingHighchartComponent', () => {
  let component: VariablePeriodFoldingHighchartComponent;
  let fixture: ComponentFixture<VariablePeriodFoldingHighchartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VariablePeriodFoldingHighchartComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(VariablePeriodFoldingHighchartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
