import { Component } from '@angular/core';
import { ChartAction } from "../../shared/types/actions";
import { HonorCodePopupService } from "../../shared/honor-code-popup/honor-code-popup.service";
import { HonorCodeChartService } from "../../shared/honor-code-popup/honor-code-chart.service";
import { DualService } from "../dual.service";
import { MatDialog } from "@angular/material/dialog";
import { DualChartFormComponent } from "../dual-chart-form/dual-chart-form.component";
import { AppearanceService } from "../../../shared/settings/appearance/service/appearance.service";
import { ChartType } from "../../../shared/settings/appearance/service/appearance.utils";

@Component({
  selector: 'app-dual',
  templateUrl: './dual.component.html',
  styleUrls: ['./dual.component.scss', "../../shared/interface/tools.scss"]
})
export class DualComponent {
  protected activeChartType: ChartType = ChartType.HIGHCHARTS;
  protected readonly ChartType = ChartType;

  constructor(private service: DualService,
    private honorCodeService: HonorCodePopupService,
    private chartService: HonorCodeChartService,
    public dialog: MatDialog,
    private appearanceService: AppearanceService) {
    this.appearanceService.chartType$.subscribe((type: ChartType) => {
      this.activeChartType = type;
    });
  }

  actionHandler(actions: ChartAction[]) {
    actions.forEach((action) => {
      if (action.action === "addRow") {
        this.service.addRow(-1, 1);
      } else if (action.action === "saveGraph") {
        this.saveGraph();
      } else if (action.action === "resetData") {
        this.service.resetData();
      } else if (action.action === "editChartInfo") {
        const dialogRef =
          this.dialog.open(DualChartFormComponent, { width: 'fit-content' });
        dialogRef.afterClosed().pipe().subscribe(result => {
          if (result === "saveGraph")
            this.saveGraph();
        });
      }
    });
  }

  private saveGraph() {
    this.honorCodeService.honored().subscribe((name: string) => {
      this.chartService.saveImageEChartOffline(this.service.getEChart(), "dual", name);
    })
  }
}
