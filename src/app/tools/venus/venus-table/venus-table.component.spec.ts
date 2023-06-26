import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VenusTableComponent } from './venus-table.component';

describe('VenusTableComponent', () => {
  let component: VenusTableComponent;
  let fixture: ComponentFixture<VenusTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VenusTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VenusTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
