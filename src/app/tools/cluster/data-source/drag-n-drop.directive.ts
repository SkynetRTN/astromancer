import {Directive, HostBinding, HostListener} from '@angular/core';
import {ClusterDataSourceService} from "./cluster-data-source.service";
import {ClusterDataService} from "../cluster-data.service";
import {ClusterService} from "../cluster.service";

@Directive({
  selector: '[clusterDragNDrop]'
})
export class DragNDropDirective {
  @HostBinding('class.fileOver') fileOver: boolean;

  constructor(private clusterDataSourceService: ClusterDataSourceService,
              private dataService: ClusterDataService,
              private service: ClusterService) {
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
    this.service.reset();
    this.dataService.reset();
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = false;
    const files = evt.dataTransfer.files;
    if (files.length > 0) {
      this.clusterDataSourceService.onFileUpload(files[0]);
    }
  }

}
