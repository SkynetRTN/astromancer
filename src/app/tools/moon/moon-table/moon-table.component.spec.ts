import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MoonTableComponent} from './moon-table.component';

describe('MoonTableComponent', () => {
  let component: MoonTableComponent;
  let fixture: ComponentFixture<MoonTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MoonTableComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(MoonTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
