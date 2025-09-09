import {ComponentFixture, TestBed} from '@angular/core/testing';

import {GalaxyComponent} from './galaxy.component';

describe('GalaxyComponent', () => {
  let component: GalaxyComponent;
  let fixture: ComponentFixture<GalaxyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GalaxyComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(GalaxyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
