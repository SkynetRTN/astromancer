import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FieldStarRemovalComponent} from './field-star-removal.component';

describe('FieldStarRemovalComponent', () => {
  let component: FieldStarRemovalComponent;
  let fixture: ComponentFixture<FieldStarRemovalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FieldStarRemovalComponent]
    });
    fixture = TestBed.createComponent(FieldStarRemovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
