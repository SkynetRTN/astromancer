import { Component } from '@angular/core';
import { AppearanceService } from "../settings/appearance/service/appearance.service";
import { ChartType } from "../settings/appearance/service/appearance.utils";

/**
 * Home page of the site
 */
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss', '../../tools/shared/interface/tools.scss']
})
export class HomeComponent {

  protected readonly ECHART_TOOLS_WHITELIST = ['curve', 'moon', 'venus', 'scatter', 'spectrum', 'galaxy', 'dual'];

  constructor(private appearanceService: AppearanceService) {
  }

  protected shouldShowEcharts(tool: string): boolean {
    return this.appearanceService.getChartType() === ChartType.ECHARTS && this.ECHART_TOOLS_WHITELIST.includes(tool);
  }

}
