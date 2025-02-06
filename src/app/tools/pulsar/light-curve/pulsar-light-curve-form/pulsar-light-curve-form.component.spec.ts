import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PulsarLightCurveFormComponent} from './pulsar-light-curve-form.component';

describe('PulsarLightCurveFormComponent', () => {
  let component: PulsarLightCurveFormComponent;
  let fixture: ComponentFixture<PulsarLightCurveFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PulsarLightCurveFormComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PulsarLightCurveFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
