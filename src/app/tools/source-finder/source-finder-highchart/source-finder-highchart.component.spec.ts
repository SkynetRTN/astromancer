import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SourceFinderHighchartComponent } from './source-finder-highchart.component';

describe('SourceFinderHighchartComponent', () => {
  let component: SourceFinderHighchartComponent;
  let fixture: ComponentFixture<SourceFinderHighchartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SourceFinderHighchartComponent]
    });
    fixture = TestBed.createComponent(SourceFinderHighchartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
