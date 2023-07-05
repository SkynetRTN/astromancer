import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SpectrumComponent} from './spectrum.component';

describe('SpectrumComponent', () => {
  let component: SpectrumComponent;
  let fixture: ComponentFixture<SpectrumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SpectrumComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SpectrumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
