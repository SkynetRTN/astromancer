import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlotListEntryComponent } from './plot-list-entry.component';

describe('PlotListEntryComponent', () => {
  let component: PlotListEntryComponent;
  let fixture: ComponentFixture<PlotListEntryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlotListEntryComponent]
    });
    fixture = TestBed.createComponent(PlotListEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
