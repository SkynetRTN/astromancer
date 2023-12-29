import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterControlsComponent } from './filter-controls.component';

describe('FilterControlsComponent', () => {
  let component: FilterControlsComponent;
  let fixture: ComponentFixture<FilterControlsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FilterControlsComponent]
    });
    fixture = TestBed.createComponent(FilterControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
