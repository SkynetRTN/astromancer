import {ComponentFixture, TestBed} from '@angular/core/testing';

import {GravitySpectogramComponent} from './gravity-spectogram.component';

describe('GravityHighchartComponent', () => {
  let component: GravitySpectogramComponent;
  let fixture: ComponentFixture<GravitySpectogramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GravitySpectogramComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(GravitySpectogramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
