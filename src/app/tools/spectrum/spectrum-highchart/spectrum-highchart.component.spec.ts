import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpectrumHighchartComponent } from './spectrum-highchart.component';

describe('SpectrumHighchartComponent', () => {
  let component: SpectrumHighchartComponent;
  let fixture: ComponentFixture<SpectrumHighchartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpectrumHighchartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpectrumHighchartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
