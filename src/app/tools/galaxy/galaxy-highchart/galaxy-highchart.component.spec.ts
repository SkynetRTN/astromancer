import {ComponentFixture, TestBed} from '@angular/core/testing';

import {GalaxyHighchartComponent} from './galaxy-highchart.component';

describe('GalaxyHighchartComponent', () => {
  let component: GalaxyHighchartComponent;
  let fixture: ComponentFixture<GalaxyHighchartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GalaxyHighchartComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(GalaxyHighchartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
