import {ComponentFixture, TestBed} from '@angular/core/testing';

import {StandardGraphInfoComponent} from './standard-graph-info.component';

describe('StandardGraphinfoComponent', () => {
  let component: StandardGraphInfoComponent;
  let fixture: ComponentFixture<StandardGraphInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StandardGraphInfoComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StandardGraphInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
