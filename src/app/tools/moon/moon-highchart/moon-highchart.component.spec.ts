import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoonHighchartComponent } from './moon-highchart.component';

describe('MoonHighchartComponent', () => {
  let component: MoonHighchartComponent;
  let fixture: ComponentFixture<MoonHighchartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MoonHighchartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoonHighchartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
