import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MoonChartFormComponent} from './moon-chart-form.component';

describe('MoonChartFormComponent', () => {
  let component: MoonChartFormComponent;
  let fixture: ComponentFixture<MoonChartFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MoonChartFormComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(MoonChartFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
