import {ComponentFixture, TestBed} from '@angular/core/testing';

import {HonorCodePopupComponent} from './honor-code-popup.component';

describe('HonorCodePopupComponent', () => {
  let component: HonorCodePopupComponent;
  let fixture: ComponentFixture<HonorCodePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HonorCodePopupComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(HonorCodePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
