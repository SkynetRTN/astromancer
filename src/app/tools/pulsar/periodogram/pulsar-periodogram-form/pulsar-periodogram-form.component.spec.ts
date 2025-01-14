import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PulsarPeriodogramFormComponent} from './pulsar-periodogram-form.component';

describe('PulsarPeriodogramFormComponent', () => {
  let component: PulsarPeriodogramFormComponent;
  let fixture: ComponentFixture<PulsarPeriodogramFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PulsarPeriodogramFormComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PulsarPeriodogramFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
