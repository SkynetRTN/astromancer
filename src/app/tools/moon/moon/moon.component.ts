import {Component} from '@angular/core';
import {ChartAction} from "../../shared/types/actions";
import {MoonService} from "../moon.service";
import {HonorCodePopupService} from "../../shared/honor-code-popup/honor-code-popup.service";
import {HonorCodeChartService} from "../../shared/honor-code-popup/honor-code-chart.service";
import {MatDialog} from "@angular/material/dialog";
import {MoonChartFormComponent} from "../moon-chart-form/moon-chart-form.component";

@Component({
  selector: 'app-moon',
  templateUrl: './moon.component.html',
  styleUrls: ['./moon.component.scss', "../../shared/interface/tools.scss"],
})
export class MoonComponent {
  constructor(private service: MoonService,
              private honorCodeService: HonorCodePopupService,
              private chartService: HonorCodeChartService,
              public dialog: MatDialog) {
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
        const dialogRef = this.dialog.open(MoonChartFormComponent, {width: 'fit-content'});
        dialogRef.afterClosed().pipe().subscribe(result => {
          if (result === "saveGraph")
            this.saveGraph();
        });
      } else if (action.action === "resetModel") {
        this.service.resetInterface();
      }
    })
  }

  private saveGraph() {
    this.honorCodeService.honored().subscribe((name: string) => {
      this.chartService.saveImageHighChartOffline(this.service.getHighChart(), "moon", name);
    })
  }
}
