import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoonFormComponent } from './moon-form.component';

describe('MoonFormComponent', () => {
  let component: MoonFormComponent;
  let fixture: ComponentFixture<MoonFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MoonFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoonFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
