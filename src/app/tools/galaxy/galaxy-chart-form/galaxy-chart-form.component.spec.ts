import {ComponentFixture, TestBed} from '@angular/core/testing';

import {GalaxyChartFormComponent} from './galaxy-chart-form.component';

describe('GalaxyChartFormComponent', () => {
  let component: GalaxyChartFormComponent;
  let fixture: ComponentFixture<GalaxyChartFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GalaxyChartFormComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(GalaxyChartFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
