import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VariablePeriodFoldingComponent } from './variable-period-folding.component';

describe('VariablePeriodFoldingComponent', () => {
  let component: VariablePeriodFoldingComponent;
  let fixture: ComponentFixture<VariablePeriodFoldingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VariablePeriodFoldingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VariablePeriodFoldingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
