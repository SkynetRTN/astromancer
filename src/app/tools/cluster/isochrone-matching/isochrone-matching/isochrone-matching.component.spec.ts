import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsochroneMatchingComponent } from './isochrone-matching.component';

describe('IsochroneMatchingComponent', () => {
  let component: IsochroneMatchingComponent;
  let fixture: ComponentFixture<IsochroneMatchingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IsochroneMatchingComponent]
    });
    fixture = TestBed.createComponent(IsochroneMatchingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
