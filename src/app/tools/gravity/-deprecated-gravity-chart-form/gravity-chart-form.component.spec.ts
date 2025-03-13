import {ComponentFixture, TestBed} from '@angular/core/testing';

import {GravityChartFormComponent} from './gravity-chart-form.component';

describe('GravityChartFormComponent', () => {
  let component: GravityChartFormComponent;
  let fixture: ComponentFixture<GravityChartFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GravityChartFormComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(GravityChartFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
