import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlotListsComponent } from './plot-lists.component';

describe('PlotListsComponent', () => {
  let component: PlotListsComponent;
  let fixture: ComponentFixture<PlotListsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlotListsComponent]
    });
    fixture = TestBed.createComponent(PlotListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
