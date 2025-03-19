import {ComponentFixture, TestBed} from '@angular/core/testing';

import {GravityComponent} from './gravity.component';

<<<<<<< HEAD:src/app/tools/gravity/gravity/gravity.component.spec.ts
describe('GravityComponent', () => {
  let component: GravityComponent;
  let fixture: ComponentFixture<GravityComponent>;
=======
describe('RadioSearchComponent', () => {
  let component: RadioSearchComponent;
  let fixture: ComponentFixture<RadioSearchComponent>;
>>>>>>> a2bdf55d9e7668d5308c13a2d3c165544f39b4e6:src/app/tools/radiosearch/radiosearch.component.spec.ts

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GravityComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(GravityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
