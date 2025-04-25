import {Directive, HostBinding, HostListener, Output, EventEmitter} from '@angular/core';

@Directive({
  selector: '[dragNDrop]'
})
export class DragNDropDirective {
  @HostBinding('class.fileOver') fileOver: boolean;

  @Output() fileDrop:EventEmitter<any> = new EventEmitter();


  constructor() {
    this.fileOver = false;
  }

  @HostListener('dragover', ['$event']) onDragOver(evt: any) {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = true;
  }

  @HostListener('dragleave', ['$event'])
  public onDragLeave(evt: any) {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = false;
  }

  @HostListener('drop', ['$event'])
  public onDrop(evt: any) {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = false;

    
    this.fileDrop.emit(evt.dataTransfer?.files[0]);
    }
  }
