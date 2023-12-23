import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ArchiveFetchingComponent} from './archive-fetching.component';

describe('ArchiveFetchingComponent', () => {
  let component: ArchiveFetchingComponent;
  let fixture: ComponentFixture<ArchiveFetchingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ArchiveFetchingComponent]
    });
    fixture = TestBed.createComponent(ArchiveFetchingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
