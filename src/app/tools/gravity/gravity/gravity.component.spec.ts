import {ComponentFixture, TestBed} from '@angular/core/testing';

import {GravityComponent} from './gravity.component';

describe('GravityComponent', () => {
  let component: GravityComponent;
  let fixture: ComponentFixture<GravityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GravityComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(GravityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
