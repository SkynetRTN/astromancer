import {ComponentFixture, TestBed} from '@angular/core/testing';

import {VariableLightCurveComponent} from './variable-light-curve.component';

describe('VariableLightCurveComponent', () => {
  let component: VariableLightCurveComponent;
  let fixture: ComponentFixture<VariableLightCurveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VariableLightCurveComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(VariableLightCurveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
