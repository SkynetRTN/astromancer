import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SimpleGraphButtonComponent} from './simple-graph-button.component';

describe('SimpleGraphButtonComponent', () => {
  let component: SimpleGraphButtonComponent;
  let fixture: ComponentFixture<SimpleGraphButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SimpleGraphButtonComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SimpleGraphButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
