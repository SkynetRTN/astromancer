import { Component, } from '@angular/core';
import { MyAction } from "../shared/types/actions";
import { CurveService } from "./curve.service";
import { HonorCodePopupService } from "../shared/honor-code-popup/honor-code-popup.service";
import { HonorCodeChartService } from "../shared/honor-code-popup/honor-code-chart.service";
import { MatDialog } from "@angular/material/dialog";
import { CurveChartFormComponent } from "./curve-chart-form/curve-chart-form.component";
import { AppearanceService } from "../../shared/settings/appearance/service/appearance.service";
import { ChartType } from "../../shared/settings/appearance/service/appearance.utils";

/**
 * Curve Component
 */
@Component({
  selector: 'app-curve',
  templateUrl: './curve.component.html',
  styleUrls: ['./curve.component.scss', '../shared/interface/tools.scss'],
  providers: [],
})
export class CurveComponent {
  protected activeChartType: ChartType = ChartType.HIGHCHARTS;
  protected readonly ChartType = ChartType;

  constructor(private service: CurveService,
    private honorCodeService: HonorCodePopupService,
    private chartService: HonorCodeChartService,
    public dialog: MatDialog,
    private appearanceService: AppearanceService) {
    this.appearanceService.chartType$.subscribe((type: ChartType) => {
      this.activeChartType = type;
    });
  }

  actionHandler(actions: MyAction[]) {
    actions.forEach((action) => {
      if (action.action === "addRow") {
        this.service.addRow(-1, 1);
      } else if (action.action === "saveGraph") {
        this.saveGraph();
      } else if (action.action === "resetData") {
        this.service.resetData();
      } else if (action.action === "resetChartInfo") {
        this.service.resetChartInfo();
      } else if (action.action === "editChartInfo") {
        const dialogRef = this.dialog.open(CurveChartFormComponent, { width: 'fit-content' });
        dialogRef.afterClosed().pipe().subscribe(result => {
          if (result === "saveGraph")
            this.saveGraph();
        });
      }
    })
  }

  private saveGraph() {
    this.honorCodeService.honored().subscribe((name: string) => {
      this.chartService.saveImageEChartOffline(this.service.getEChart(), "curve", name);
    })
  }
}
