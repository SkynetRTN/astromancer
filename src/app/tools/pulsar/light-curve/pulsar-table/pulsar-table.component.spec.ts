import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PulsarTableComponent} from './pulsar-table.component';

describe('PulsarTableComponent', () => {
  let component: PulsarTableComponent;
  let fixture: ComponentFixture<PulsarTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PulsarTableComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PulsarTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
