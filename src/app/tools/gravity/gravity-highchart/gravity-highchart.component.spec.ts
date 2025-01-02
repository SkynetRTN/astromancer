import {ComponentFixture, TestBed} from '@angular/core/testing';

import {GravityHighchartComponent} from './gravity-highchart.component';

describe('GravityHighchartComponent', () => {
  let component: GravityHighchartComponent;
  let fixture: ComponentFixture<GravityHighchartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GravityHighchartComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(GravityHighchartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
