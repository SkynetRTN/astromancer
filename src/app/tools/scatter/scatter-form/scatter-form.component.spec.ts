import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ScatterFormComponent} from './scatter-form.component';

describe('ScatterFormComponent', () => {
  let component: ScatterFormComponent;
  let fixture: ComponentFixture<ScatterFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ScatterFormComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ScatterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
