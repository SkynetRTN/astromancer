import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurveTableComponent } from './curve-table.component';

describe('CurveTableComponent', () => {
  let component: CurveTableComponent;
  let fixture: ComponentFixture<CurveTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurveTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurveTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
