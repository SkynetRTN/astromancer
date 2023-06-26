import {ComponentFixture, TestBed} from '@angular/core/testing';

import {VenusHighchartComponent} from './venus-highchart.component';

describe('VenusHighchartComponent', () => {
  let component: VenusHighchartComponent;
  let fixture: ComponentFixture<VenusHighchartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VenusHighchartComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(VenusHighchartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
