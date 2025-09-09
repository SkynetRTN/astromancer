import {ComponentFixture, TestBed} from '@angular/core/testing';

import {GalaxyTableComponent} from './galaxy-table.component';

describe('GalaxyTableComponent', () => {
  let component: GalaxyTableComponent;
  let fixture: ComponentFixture<GalaxyTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GalaxyTableComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(GalaxyTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
