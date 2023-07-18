import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent {
  clusterName: string = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data:
                { source: string, filters: string[], starCounts: number, clusterName: string }) {
    this.clusterName = data.clusterName;
  }
}
