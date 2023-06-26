import {Component} from '@angular/core';
import {ChartAction} from "../../shared/types/actions";

@Component({
  selector: 'app-venus',
  templateUrl: './venus.component.html',
  styleUrls: ['./venus.component.scss']
})
export class VenusComponent {

  actionHandler(actions: ChartAction[]) {
    actions.forEach((action) => {
      if (action.action === "addRow") {
        // this.service.addRow(-1, 1);
      } else if (action.action === "saveGraph") {
        // this.honorCodeService.honored().subscribe((name: string) => {
        //   this.chartService.saveImageHighChartOffline(this.service.getHighChart(), "curve", name);
        // })
      } else if (action.action === "resetData") {
        // this.service.resetData();
      } else if (action.action === "resetChartInfo") {
        // this.service.resetChartInfo();
      }
    });
  }
}
