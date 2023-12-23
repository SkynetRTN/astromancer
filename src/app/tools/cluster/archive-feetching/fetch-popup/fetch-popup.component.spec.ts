import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FetchPopupComponent} from './fetch-popup.component';

describe('FetchPopupComponent', () => {
  let component: FetchPopupComponent;
  let fixture: ComponentFixture<FetchPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FetchPopupComponent]
    });
    fixture = TestBed.createComponent(FetchPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
