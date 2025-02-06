import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PulsarPeriodFoldingComponent} from './pulsar-period-folding.component';

describe('PulsarPeriodFoldingComponent', () => {
  let component: PulsarPeriodFoldingComponent;
  let fixture: ComponentFixture<PulsarPeriodFoldingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PulsarPeriodFoldingComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PulsarPeriodFoldingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
