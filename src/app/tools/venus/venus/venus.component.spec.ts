import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VenusComponent } from './venus.component';

describe('VenusComponent', () => {
  let component: VenusComponent;
  let fixture: ComponentFixture<VenusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VenusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VenusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
