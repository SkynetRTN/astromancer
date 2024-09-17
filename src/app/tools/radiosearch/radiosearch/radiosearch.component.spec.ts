import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RadioSearchComponent} from './radiosearch.component';

describe('MoonComponent', () => {
  let component: RadioSearchComponent;
  let fixture: ComponentFixture<RadioSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RadioSearchComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RadioSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
