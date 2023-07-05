import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SpectrumFormComponent} from './spectrum-form.component';

describe('SpectrumFormComponent', () => {
  let component: SpectrumFormComponent;
  let fixture: ComponentFixture<SpectrumFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SpectrumFormComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SpectrumFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
