import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ArchiveFetchingGraphicsComponent} from './archive-fetching-graphics.component';

describe('ArchiveFetchingGraphicsComponent', () => {
  let component: ArchiveFetchingGraphicsComponent;
  let fixture: ComponentFixture<ArchiveFetchingGraphicsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ArchiveFetchingGraphicsComponent]
    });
    fixture = TestBed.createComponent(ArchiveFetchingGraphicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
