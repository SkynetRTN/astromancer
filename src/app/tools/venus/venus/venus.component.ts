import {Component} from '@angular/core';
import {ChartAction} from "../../shared/types/actions";
import {VenusService} from "../venus.service";
import {HonorCodePopupService} from "../../shared/honor-code-popup/honor-code-popup.service";
import {HonorCodeChartService} from "../../shared/honor-code-popup/honor-code-chart.service";

@Component({
  selector: 'app-venus',
  templateUrl: './venus.component.html',
  styleUrls: ['./venus.component.scss']
})
export class VenusComponent {

  constructor(private service: VenusService,
              private honorCodeService: HonorCodePopupService,
              private chartService: HonorCodeChartService) {
  }

  actionHandler(actions: ChartAction[]) {
    actions.forEach((action) => {
      if (action.action === "addRow") {
        this.service.addRow(-1, 1);
      } else if (action.action === "saveGraph") {
        this.honorCodeService.honored().subscribe((name: string) => {
          this.chartService.saveImageHighChartOffline(this.service.getHighChart(), "venus", name);
        })
      } else if (action.action === "resetData") {
        this.service.resetData();
      } else if (action.action === "resetChartInfo") {
        this.service.resetChartInfo();
      }
    });
  }
}
