import {ComponentFixture, TestBed} from '@angular/core/testing';

import {GravityStrainchartComponent} from './gravity-strainchart.component';

describe('GravityHighchartComponent', () => {
  let component: GravityStrainchartComponent;
  let fixture: ComponentFixture<GravityStrainchartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GravityStrainchartComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(GravityStrainchartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
