import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ScatterHighchartComponent} from './scatter-highchart.component';

describe('ScatterHighchartComponent', () => {
  let component: ScatterHighchartComponent;
  let fixture: ComponentFixture<ScatterHighchartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ScatterHighchartComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ScatterHighchartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
