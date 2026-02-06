import { Component, OnDestroy } from '@angular/core';
import { AppearanceService } from "../../../../shared/settings/appearance/service/appearance.service";
import { ChartType } from "../../../../shared/settings/appearance/service/appearance.utils";

@Component({
  selector: 'app-variable-period-folding',
  templateUrl: './variable-period-folding.component.html',
  styleUrls: ['./variable-period-folding.component.scss', '../../../shared/interface/tools.scss']
})
export class VariablePeriodFoldingComponent {
  public chartType$ = this.appearanceService.chartType$;
  public ChartType = ChartType;

  constructor(private appearanceService: AppearanceService) {
  }
}
