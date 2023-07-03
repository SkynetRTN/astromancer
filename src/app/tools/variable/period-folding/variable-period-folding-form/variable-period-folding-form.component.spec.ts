import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VariablePeriodFoldingFormComponent } from './variable-period-folding-form.component';

describe('VariablePeriodFoldingFormComponent', () => {
  let component: VariablePeriodFoldingFormComponent;
  let fixture: ComponentFixture<VariablePeriodFoldingFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VariablePeriodFoldingFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VariablePeriodFoldingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
