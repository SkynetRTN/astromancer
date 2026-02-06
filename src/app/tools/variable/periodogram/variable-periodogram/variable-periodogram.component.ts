import { Component } from '@angular/core';
import { AppearanceService } from "../../../../shared/settings/appearance/service/appearance.service";
import { ChartType } from "../../../../shared/settings/appearance/service/appearance.utils";

@Component({
  selector: 'app-variable-periodogram',
  templateUrl: './variable-periodogram.component.html',
  styleUrls: ['./variable-periodogram.component.scss',
    '../../../shared/interface/tools.scss',]
})
export class VariablePeriodogramComponent {
  public chartType$ = this.appearanceService.chartType$;
  public ChartType = ChartType;

  constructor(private appearanceService: AppearanceService) {
  }
}
