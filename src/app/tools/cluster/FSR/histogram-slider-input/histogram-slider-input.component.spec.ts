import {ComponentFixture, TestBed} from '@angular/core/testing';

import {HistogramSliderInputComponent} from './histogram-slider-input.component';

describe('HistogramSliderInputComponent', () => {
  let component: HistogramSliderInputComponent;
  let fixture: ComponentFixture<HistogramSliderInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HistogramSliderInputComponent]
    });
    fixture = TestBed.createComponent(HistogramSliderInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
