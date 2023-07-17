import {Component} from '@angular/core';
import {ClusterDataSourceService} from "../cluster-data-source.service";

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent {

  constructor(private dataSourceService: ClusterDataSourceService) {
  }

  onFileUpload($event: Event) {
    this.dataSourceService.onFileUpload(($event as any).target['files'][0]);
  }
}
