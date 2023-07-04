import {ComponentFixture, TestBed} from '@angular/core/testing';

import {VariablePeriodogramFormComponent} from './variable-periodogram-form.component';

describe('VariablePeriodogramFormComponent', () => {
  let component: VariablePeriodogramFormComponent;
  let fixture: ComponentFixture<VariablePeriodogramFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VariablePeriodogramFormComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(VariablePeriodogramFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
