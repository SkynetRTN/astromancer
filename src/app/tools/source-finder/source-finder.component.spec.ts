import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SourceFinderComponent } from './source-finder.component';

describe('SourceFinderComponent', () => {
  let component: SourceFinderComponent;
  let fixture: ComponentFixture<SourceFinderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SourceFinderComponent]
    });
    fixture = TestBed.createComponent(SourceFinderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
