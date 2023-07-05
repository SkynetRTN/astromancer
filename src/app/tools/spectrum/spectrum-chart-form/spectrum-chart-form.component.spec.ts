import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SpectrumChartFormComponent} from './spectrum-chart-form.component';

describe('SpectrumChartFormComponent', () => {
  let component: SpectrumChartFormComponent;
  let fixture: ComponentFixture<SpectrumChartFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SpectrumChartFormComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SpectrumChartFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
