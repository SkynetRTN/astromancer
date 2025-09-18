import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PulsarLightCurveSonifierComponent } from './pulsar-light-curve-sonifier.component';

describe('PulsarLightCurveSonifierComponent', () => {
  let component: PulsarLightCurveSonifierComponent;
  let fixture: ComponentFixture<PulsarLightCurveSonifierComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PulsarLightCurveSonifierComponent]
    });
    fixture = TestBed.createComponent(PulsarLightCurveSonifierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
