import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RcComponent } from './rc.component';

describe('RcComponent', () => {
  let component: RcComponent;
  let fixture: ComponentFixture<RcComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RcComponent]
    });
    fixture = TestBed.createComponent(RcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
