import {ComponentFixture, TestBed} from '@angular/core/testing';

import {GalaxyFormComponent} from './galaxy-form.component';

describe('GalaxyFormComponent', () => {
  let component: GalaxyFormComponent;
  let fixture: ComponentFixture<GalaxyFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GalaxyFormComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(GalaxyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
