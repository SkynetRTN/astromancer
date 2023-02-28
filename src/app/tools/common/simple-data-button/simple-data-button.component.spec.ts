import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleDataButtonComponent } from './simple-data-button.component';

describe('SimpleDataButtonComponent', () => {
  let component: SimpleDataButtonComponent;
  let fixture: ComponentFixture<SimpleDataButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimpleDataButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleDataButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
