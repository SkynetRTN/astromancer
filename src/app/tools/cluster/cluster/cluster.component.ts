import {Component} from '@angular/core';
import {ClusterService} from "../cluster.service";

@Component({
  selector: 'app-cluster',
  templateUrl: './cluster.component.html',
  styleUrls: ['./cluster.component.scss', '../../shared/interface/tools.scss']
})
export class ClusterComponent {
    constructor(public service: ClusterService) {
    }
}
