import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PmChartComponent} from './pm-chart.component';

describe('PmChartComponent', () => {
  let component: PmChartComponent;
  let fixture: ComponentFixture<PmChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PmChartComponent]
    });
    fixture = TestBed.createComponent(PmChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
