import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SpectrumTableComponent} from './spectrum-table.component';

describe('SpectrumTableComponent', () => {
  let component: SpectrumTableComponent;
  let fixture: ComponentFixture<SpectrumTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SpectrumTableComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SpectrumTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
