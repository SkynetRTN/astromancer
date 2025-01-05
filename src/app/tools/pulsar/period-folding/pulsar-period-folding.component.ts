import {Component} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {PulsarService} from '../pulsar.service';
import { HonorCodePopupService } from '../../shared/honor-code-popup/honor-code-popup.service';
import { HonorCodeChartService } from '../../shared/honor-code-popup/honor-code-chart.service';

@Component({
  selector: 'app-pulsar-period-folding',
  templateUrl: './pulsar-period-folding.component.html',
  styleUrls: ['./pulsar-period-folding.component.scss', '../../shared/interface/tools.scss']
})
export class PulsarPeriodFoldingComponent {

  constructor(
    private service: PulsarService, // Inject the service
    private honorCodeService: HonorCodePopupService,
    private chartService: HonorCodeChartService
  ) {}

  chartTitle: string = '';
  dataLabel: string = '';
  xAxisLabel: string = '';
  yAxisLabel: string = '';
  displayPeriod: string = '';
  periodShift: number = 0;
  phaseShift: number = 0;

  periodSubject = new BehaviorSubject<number>(0.1);
  phaseSubject = new BehaviorSubject<number>(0);
  twoPeriods: boolean = false; // Default value for checkbox

  saveGraph() {
    this.honorCodeService.honored().subscribe((name: string) => {
      this.chartService.saveImageHighChartOffline(this.service.getHighChart(), "Pulsar Periodogram", name);
    })
  }

  resetForm() {
    this.service.resetData();
  }

  // boolean control for two periods or onemptied

  // period shift slider from something like 0.1 second to 100 (maybe logarithmically?)

}
