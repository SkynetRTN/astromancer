import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RadioSearchCanvasComponent} from './radiosearch-canvas.component';

describe('RadioSearchCanvasComponent', () => {
  let component: RadioSearchCanvasComponent;
  let fixture: ComponentFixture<RadioSearchCanvasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RadioSearchCanvasComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RadioSearchCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
