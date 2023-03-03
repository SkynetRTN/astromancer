import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SimpleTableImplComponent} from './simple-table-impl.component';

describe('SimpleTableImplComponent', () => {
  let component: SimpleTableImplComponent;
  let fixture: ComponentFixture<SimpleTableImplComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SimpleTableImplComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleTableImplComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
