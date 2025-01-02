import {ComponentFixture, TestBed} from '@angular/core/testing';

import {GravityTableComponent} from './gravity-table.component';

describe('GravityTableComponent', () => {
  let component: GravityTableComponent;
  let fixture: ComponentFixture<GravityTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GravityTableComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(GravityTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
