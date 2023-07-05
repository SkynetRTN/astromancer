import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DualChartFormComponent} from './dual-chart-form.component';

describe('DualChartFormComponent', () => {
  let component: DualChartFormComponent;
  let fixture: ComponentFixture<DualChartFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DualChartFormComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DualChartFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
