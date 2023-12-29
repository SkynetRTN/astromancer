import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsochronePlottingControlsComponent } from './isochrone-plotting-controls.component';

describe('IsochronePlottingControlsComponent', () => {
  let component: IsochronePlottingControlsComponent;
  let fixture: ComponentFixture<IsochronePlottingControlsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IsochronePlottingControlsComponent]
    });
    fixture = TestBed.createComponent(IsochronePlottingControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
