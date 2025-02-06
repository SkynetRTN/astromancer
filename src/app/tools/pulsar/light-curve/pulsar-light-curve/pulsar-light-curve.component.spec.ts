import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PulsarLightCurveComponent} from './pulsar-light-curve.component';

describe('PulsarLightCurveComponent', () => {
  let component: PulsarLightCurveComponent;
  let fixture: ComponentFixture<PulsarLightCurveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PulsarLightCurveComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PulsarLightCurveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
