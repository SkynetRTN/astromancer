import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SourceFinderFormComponent } from './source-finder-form.component';

describe('SourceFinderFormComponent', () => {
  let component: SourceFinderFormComponent;
  let fixture: ComponentFixture<SourceFinderFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SourceFinderFormComponent]
    });
    fixture = TestBed.createComponent(SourceFinderFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
