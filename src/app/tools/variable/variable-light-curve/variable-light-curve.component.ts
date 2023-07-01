import {Component} from '@angular/core';
import {TableAction} from "../../shared/types/actions";
import {VariableService} from "../variable.service";
import {HonorCodePopupService} from "../../shared/honor-code-popup/honor-code-popup.service";
import {HonorCodeChartService} from "../../shared/honor-code-popup/honor-code-chart.service";

@Component({
  selector: 'app-variable-light-curve',
  templateUrl: './variable-light-curve.component.html',
  styleUrls: ['./variable-light-curve.component.scss']
})
export class VariableLightCurveComponent {
  constructor(private service: VariableService,
              private honorCodeService: HonorCodePopupService,
              private chartService: HonorCodeChartService) {
  }

  actionHandler(actions: TableAction[]) {
    actions.forEach((action) => {
      if (action.action === "addRow") {
        this.service.addRow(-1, 1);
      } else if (action.action === "saveGraph") {
        this.honorCodeService.honored().subscribe((name: string) => {
          // this.chartService.saveImageHighChartOffline(this.service.getHighChart(), "spectrum", name);
        })
      } else if (action.action === "resetData") {
        this.service.resetData();
      } else if (action.action === "resetChartInfo") {
        this.service.resetChartInfo();
      }
    })
  }

  uploadHandler($event: File) {
  }
}
