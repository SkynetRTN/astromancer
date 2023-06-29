import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DualHighchartComponent } from './dual-highchart.component';

describe('DualHighchartComponent', () => {
  let component: DualHighchartComponent;
  let fixture: ComponentFixture<DualHighchartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DualHighchartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DualHighchartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
