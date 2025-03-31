import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ParamMatching} from './param-matching.component';

describe('GravityComponent', () => {
  let component: ParamMatching;
  let fixture: ComponentFixture<ParamMatching>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ParamMatching]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ParamMatching);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
