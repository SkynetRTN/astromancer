import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SourceFinderCanvasComponent } from './source-finder-canvas.component';

describe('SourceFinderCanvasComponent', () => {
  let component: SourceFinderCanvasComponent;
  let fixture: ComponentFixture<SourceFinderCanvasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SourceFinderCanvasComponent]
    });
    fixture = TestBed.createComponent(SourceFinderCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
