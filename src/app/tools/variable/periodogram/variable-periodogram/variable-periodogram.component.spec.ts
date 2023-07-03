import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VariablePeriodogramComponent } from './variable-periodogram.component';

describe('VariablePeriodogramComponent', () => {
  let component: VariablePeriodogramComponent;
  let fixture: ComponentFixture<VariablePeriodogramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VariablePeriodogramComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VariablePeriodogramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
