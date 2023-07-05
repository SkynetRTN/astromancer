import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ScatterTableComponent} from './scatter-table.component';

describe('ScatterTableComponent', () => {
  let component: ScatterTableComponent;
  let fixture: ComponentFixture<ScatterTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ScatterTableComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ScatterTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
