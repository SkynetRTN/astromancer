import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ClusterStepperComponent} from './cluster-stepper.component';

describe('ClusterStepperComponent', () => {
  let component: ClusterStepperComponent;
  let fixture: ComponentFixture<ClusterStepperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClusterStepperComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ClusterStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
