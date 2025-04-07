import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FileUploadBigComponent} from './file-upload-big.component';

describe('FileUploadComponent', () => {
  let component: FileUploadBigComponent;
  let fixture: ComponentFixture<FileUploadBigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FileUploadBigComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(FileUploadBigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
