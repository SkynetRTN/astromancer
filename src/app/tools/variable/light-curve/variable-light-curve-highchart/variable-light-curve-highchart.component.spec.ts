import {ComponentFixture, TestBed} from '@angular/core/testing';

import {VariableLightCurveHighchartComponent} from './variable-light-curve-highchart.component';

describe('VariableLightCurveHighchartComponent', () => {
  let component: VariableLightCurveHighchartComponent;
  let fixture: ComponentFixture<VariableLightCurveHighchartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VariableLightCurveHighchartComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(VariableLightCurveHighchartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
