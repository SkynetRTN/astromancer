import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DualTableComponent} from './dual-table.component';

describe('DualTableComponent', () => {
  let component: DualTableComponent;
  let fixture: ComponentFixture<DualTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DualTableComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DualTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
