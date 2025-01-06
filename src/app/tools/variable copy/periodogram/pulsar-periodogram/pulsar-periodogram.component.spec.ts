import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PulsarPeriodogramComponent} from './pulsar-periodogram.component';

describe('PulsarPeriodogramComponent', () => {
  let component: PulsarPeriodogramComponent;
  let fixture: ComponentFixture<PulsarPeriodogramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PulsarPeriodogramComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PulsarPeriodogramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
