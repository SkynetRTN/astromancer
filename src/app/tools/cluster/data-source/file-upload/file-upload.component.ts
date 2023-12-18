import {Component} from '@angular/core';
import {ClusterDataSourceService} from "../cluster-data-source.service";
import {ClusterDataService} from "../../cluster-data.service";
import {ClusterService} from "../../cluster.service";

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent {

  constructor(private dataSourceService: ClusterDataSourceService,
              private dataService: ClusterDataService,
              private service: ClusterService) {
  }

  onFileUpload($event: Event) {
    this.service.reset();
    this.dataService.reset();
    this.dataSourceService.onFileUpload(($event as any).target['files'][0]);
  }
}
