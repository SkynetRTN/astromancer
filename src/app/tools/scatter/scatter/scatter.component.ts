import {Component} from '@angular/core';
import {ChartAction} from "../../shared/types/actions";
import {ScatterService} from "../scatter.service";

@Component({
  selector: 'app-scatter',
  templateUrl: './scatter.component.html',
  styleUrls: ['./scatter.component.scss']
})
export class ScatterComponent {
  constructor(private service: ScatterService) {
  }

  actionHandler(actions: ChartAction[]) {
    actions.forEach((action) => {
      if (action.action === "addRow") {
        this.service.addRow(-1, 1);
      } else if (action.action === "saveGraph") {
        // this.honorCodeService.honored().subscribe((name: string) => {
        //   this.chartService.saveImageHighChartOffline(this.service.getHighChart(), "moon", name);
        // })
      } else if (action.action === "resetData") {
        this.service.resetData();
      } else if (action.action === "resetChartInfo") {
        // this.service.resetChartInfo();
      } else if (action.action === "resetModel") {
        // this.service.resetInterface();
      }
    })
  }
}
