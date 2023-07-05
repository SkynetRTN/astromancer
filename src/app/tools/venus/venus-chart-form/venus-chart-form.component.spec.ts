import {ComponentFixture, TestBed} from '@angular/core/testing';

import {VenusChartFormComponent} from './venus-chart-form.component';

describe('VenusChartFormComponent', () => {
  let component: VenusChartFormComponent;
  let fixture: ComponentFixture<VenusChartFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VenusChartFormComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(VenusChartFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
