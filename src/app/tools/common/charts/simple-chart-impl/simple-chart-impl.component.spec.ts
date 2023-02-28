import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleChartImplComponent } from './simple-chart-impl.component';

describe('SimpleChartImplComponent', () => {
  let component: SimpleChartImplComponent;
  let fixture: ComponentFixture<SimpleChartImplComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimpleChartImplComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleChartImplComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
