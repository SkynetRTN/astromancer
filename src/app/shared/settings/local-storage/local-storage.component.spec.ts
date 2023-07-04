import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalStorageComponent } from './local-storage.component';

describe('LocalStorageComponent', () => {
  let component: LocalStorageComponent;
  let fixture: ComponentFixture<LocalStorageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LocalStorageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocalStorageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
