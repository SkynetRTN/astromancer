import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PulsarPeriodFoldingFormComponent} from './pulsar-period-folding-form.component';

describe('PulsarPeriodFoldingFormComponent', () => {
  let component: PulsarPeriodFoldingFormComponent;
  let fixture: ComponentFixture<PulsarPeriodFoldingFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PulsarPeriodFoldingFormComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PulsarPeriodFoldingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
