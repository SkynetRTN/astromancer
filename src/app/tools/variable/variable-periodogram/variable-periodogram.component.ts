import {AfterViewInit, Component, OnDestroy} from '@angular/core';
import {debounceTime, Subject, takeUntil} from "rxjs";
import * as Highcharts from "highcharts";
import {VariableService} from "../variable.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {HonorCodePopupService} from "../../shared/honor-code-popup/honor-code-popup.service";
import {HonorCodeChartService} from "../../shared/honor-code-popup/honor-code-chart.service";

@Component({
  selector: 'app-variable-periodogram',
  templateUrl: './variable-periodogram.component.html',
  styleUrls: ['./variable-periodogram.component.scss']
})
export class VariablePeriodogramComponent implements AfterViewInit, OnDestroy {
  Highcharts: typeof Highcharts = Highcharts;
  updateFlag: boolean = true;
  chartConstructor: any = "chart";
  chartObject!: Highcharts.Chart;
  chartOptions: Highcharts.Options = {
    chart: {
      animation: false,
      styledMode: true,
    },
    legend: {
      align: 'center',
    },
    tooltip: {
      enabled: true,
      shared: false,
    },
    exporting: {
      buttons: {
        contextButton: {
          enabled: false,
        }
      }
    }
  };
  private destroy$: Subject<any> = new Subject<any>();

  formGroup: any;

  constructor(private service: VariableService,
              private honorCodeService: HonorCodePopupService,
              private chartService: HonorCodeChartService) {
    this.setChartTitle();
    this.setChartXAxis();
    this.setChartYAxis();

    this.service.periodogram$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(info => {
      this.formGroup = new FormGroup({
        chartTitle: new FormControl(this.service.getPeriodogramTitle()),
        dataLabel: new FormControl(this.service.getPeriodogramDataLabel()),
        xAxisLabel: new FormControl(this.service.getPeriodogramXAxisLabel()),
        yAxisLabel: new FormControl(this.service.getPeriodogramYAxisLabel()),
        startPeriod: new FormControl(this.service.getPeriodogramStartPeriod(), [Validators.required]),
        endPeriod: new FormControl(this.service.getPeriodogramEndPeriod(), [Validators.required]),
      });
      this.formGroup.controls['chartTitle'].valueChanges.pipe(
        debounceTime(200),
      ).subscribe((title: string) => {
        this.service.setPeriodogramTitle(title);
      });
      this.formGroup.controls['xAxisLabel'].valueChanges.pipe(
        debounceTime(200),
      ).subscribe((label: string) => {
        this.service.setPeriodogramXAxisLabel(label);
      });
      this.formGroup.controls['yAxisLabel'].valueChanges.pipe(
        debounceTime(200),
      ).subscribe((label: string) => {
        this.service.setPeriodogramYAxisLabel(label);
      });
      this.formGroup.controls['dataLabel'].valueChanges.pipe(
        debounceTime(200),
      ).subscribe((label: string) => {
        this.service.setPeriodogramDataLabel(label);
      });
      this.formGroup.controls['startPeriod'].valueChanges.pipe(
        debounceTime(200),
      ).subscribe((start: number) => {
        this.service.setPeriodogramStartPeriod(start);
        this.updateData();
      });
      this.formGroup.controls['endPeriod'].valueChanges.pipe(
        debounceTime(200),
      ).subscribe((end: number) => {
        this.service.setPeriodogramEndPeriod(end);
        this.updateData();
      });
    });
  }

  chartInitialized($event: Highcharts.Chart) {
    this.chartObject = $event;
    this.service.setHighChart(this.chartObject);

  }

  ngAfterViewInit(): void {
    this.initChartSeries();
    this.service.data$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.updateData();
    });
    this.service.periodogram$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.setChartTitle();
      this.setChartXAxis();
      this.setChartYAxis();
      this.updateChart();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  initChartSeries() {
    this.setData();
  }

  setData() {
    this.chartObject.addSeries({
      name: this.service.getPeriodogramDataLabel(),
      data: this.service.getChartPeriodogramDataArray(
        this.service.getPeriodogramStartPeriod(),
        this.service.getPeriodogramEndPeriod()),
      type: 'scatter',
      marker: {
        symbol: 'circle',
        radius: 2,
      }
    })
  }

  updateData() {
    this.chartObject.series[0].update({
      name: this.service.getPeriodogramDataLabel(),
      data: this.service.getChartPeriodogramDataArray(
        this.service.getPeriodogramStartPeriod(),
        this.service.getPeriodogramEndPeriod()),
      type: 'scatter',
    });
  }


  private updateChart(): void {
    this.updateFlag = true;
  }

  private setChartTitle(): void {
    this.chartOptions.title = {text: this.service.getPeriodogramTitle()};
  }

  private setChartXAxis(): void {
    this.chartOptions.xAxis = {
      title: {text: this.service.getPeriodogramXAxisLabel()}
    };
  }

  private setChartYAxis(): void {
    this.chartOptions.yAxis = {
      title: {text: this.service.getPeriodogramYAxisLabel()}
    };
  }

  saveGraph() {
    this.honorCodeService.honored().subscribe((name: string) => {
      this.chartService.saveImageHighChartOffline(this.chartObject, "Variable Periodogram", name);
    })
  }

  resetForm() {
    this.service.resetPeriodogram();
  }

}
