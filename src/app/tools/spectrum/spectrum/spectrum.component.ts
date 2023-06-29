import { Component } from '@angular/core';
import {ChartAction, TableAction} from "../../shared/types/actions";
import {HonorCodePopupService} from "../../shared/honor-code-popup/honor-code-popup.service";

@Component({
  selector: 'app-spectrum',
  templateUrl: './spectrum.component.html',
  styleUrls: ['./spectrum.component.scss']
})
export class SpectrumComponent {
  constructor(private honorCodeService: HonorCodePopupService,) {
  }

  actionHandler(actions: ChartAction[]) {
    actions.forEach((action) => {
      if (action.action === "addRow") {
        // this.service.addRow(-1, 1);
      } else if (action.action === "saveGraph") {
        this.honorCodeService.honored().subscribe((name: string) => {
          // this.chartService.saveImageHighChartOffline(this.service.getHighChart(), "scatter", name);
        })
      } else if (action.action === "resetData") {
        // this.service.resetData();
      } else if (action.action === "resetChartInfo") {
        // this.service.resetChartInfo();
      } else if (action.action === "resetModel") {
        // this.service.resetModel();
      }
    })
  }
}
