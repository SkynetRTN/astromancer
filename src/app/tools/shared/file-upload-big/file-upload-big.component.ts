import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-file-upload-big',
  templateUrl: './file-upload-big.component.html',
  styleUrls: ['./file-upload-big.component.scss']
})
export class FileUploadBigComponent {
    @Input() format!: string;
    @Input() sourceLink!: string;
    @Output() fileUpload$: EventEmitter<File> = new EventEmitter<File>();

    private passed: boolean = false;
  

  constructor() {
  }

  onFileUpload($event: Event) {
    console.log("Upload")
    this.fileUpload$.emit(($event.target as HTMLInputElement).files![0]);
  }

  onFileDrop(file: File) {
    console.log(file)
    this.fileUpload$.emit(file)
  }
}
