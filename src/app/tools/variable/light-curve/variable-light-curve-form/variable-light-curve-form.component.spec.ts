import {ComponentFixture, TestBed} from '@angular/core/testing';

import {VariableLightCurveFormComponent} from './variable-light-curve-form.component';

describe('VariableLightCurveFormComponent', () => {
  let component: VariableLightCurveFormComponent;
  let fixture: ComponentFixture<VariableLightCurveFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VariableLightCurveFormComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(VariableLightCurveFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
