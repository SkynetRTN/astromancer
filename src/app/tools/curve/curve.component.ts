import {Component,} from '@angular/core';
import {MyAction} from "../shared/types/actions";
import {CurveService} from "./curve.service";
import {HonorCodePopupService} from "../shared/honor-code-popup/honor-code-popup.service";
import {HonorCodeChartService} from "../shared/honor-code-popup/honor-code-chart.service";

/**
 * Curve Component
 */
@Component({
  selector: 'app-curve',
  templateUrl: './curve.component.html',
  styleUrls: ['./curve.component.scss'],
  providers: [],
})
export class CurveComponent {
  constructor(private service: CurveService,
              private honorCodeService: HonorCodePopupService,
              private chartService: HonorCodeChartService) {
  }

  actionHandler(actions: MyAction[]) {
    actions.forEach((action) => {
      if (action.action === "addRow") {
        this.service.addRow(-1, 1);
      } else if (action.action === "saveGraph") {
        this.honorCodeService.honored().then((name: string) => {
          this.chartService.saveImage(this.service.getChart(), name);
        })
      } else if (action.action === "resetData") {
        this.service.resetData();
      } else if (action.action === "resetChartInfo") {
        this.service.resetChartInfo();
      }
    })
  }
}
