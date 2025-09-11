import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import * as Highcharts from "highcharts";
import { Subject, takeUntil } from "rxjs";
import { PulsarService } from "../../pulsar.service";

@Component({
  selector: 'app-pulsar-periodogram-highcharts',
  templateUrl: './pulsar-periodogram-highcharts.component.html',
  styleUrls: ['./pulsar-periodogram-highcharts.component.scss']
})
export class PulsarPeriodogramHighchartsComponent implements AfterViewInit, OnDestroy {
  Highcharts: typeof Highcharts = Highcharts;
  updateFlag: boolean = true;
  chartConstructor: any = "chart";
  chartObject!: Highcharts.Chart;
  chartOptions: Highcharts.Options = {
    chart: {
      animation: false,
      styledMode: false,
      zooming: {
        type: 'x',
        key: 'shift',
      },
    },
    legend: {
      align: 'center',
    },
    tooltip: {
      enabled: true,
      shared: false,
    },
    xAxis: {
      type: 'logarithmic',
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

  constructor(private service: PulsarService) {}

  ngAfterViewInit() {
    this.setChartTitle();
    this.setChartXAxis();
    this.setChartYAxis();
    this.setData();
    this.updateChart();

    this.service.periodogramForm$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.setChartTitle();
      this.setChartXAxis();
      this.setChartYAxis();
      this.updateChart();
    });
    this.service.isComputing$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.updateData();
    });
  }

  chartInitialized($event: Highcharts.Chart) {
    this.chartObject = $event;
    this.service.setHighChartPeriodogram(this.chartObject);
  }

  /**
   * Handles the initial creation of series from periodogram data.
   */
  setData() {
    const start = this.service.getPeriodogramStartPeriod();
    const end = this.service.getPeriodogramEndPeriod();
    const periodogramData = this.service.getChartPeriodogramDataArray(start, end);

    // Add periodogram channels
    Object.entries(periodogramData).forEach(([key, data], index) => {
      this.chartObject.addSeries({
        id: `channel-${index}`,
        name: `Channel ${index + 1}`,
        type: "line",
        data,
        marker: {
          symbol: "circle",
          radius: 3,
        },
      });
    });

    // Add static confidence lines
    this.addConfidenceLines(start, end);
  }

  /**
   * Handles dynamic updates of the series data.
   */
  updateData() {
    const start = this.service.getPeriodogramStartPeriod();
    const end = this.service.getPeriodogramEndPeriod();
    const periodogramData = this.service.getChartPeriodogramDataArray(start, end);

    // Update or add channel series
    let index = 0;
    Object.entries(periodogramData).forEach(([key, data]) => {
      const seriesId = `channel-${index}`;
      const existing = this.chartObject.get(seriesId);

      if (existing) {
        (existing as Highcharts.Series).setData(data, true);
      } else {
        this.chartObject.addSeries({
          id: seriesId,
          name: `Channel ${index + 1}`,
          type: "line",
          data,
          marker: {
            symbol: "circle",
            radius: 3,
          },
        });
      }
      index++;
    });

    // Remove excess series if fewer channels now
    this.chartObject.series
      .filter((s: any) => s.userOptions.id?.startsWith("channel-"))
      .slice(index)
      .forEach((s: any) => s.remove());

    // Update confidence lines
    this.addConfidenceLines(start, end);
  }

  /**
   * Adds or updates horizontal confidence lines.
   */
  private addConfidenceLines(x0: number, x1: number) {
    const points = this.service.getPeriodogramPoints();
    const levels = [
      { id: "conf-50", name: "50% Confidence", alpha: 0.5, color: "red" },
      { id: "conf-95", name: "95% Confidence", alpha: 0.05, color: "orange" },
      { id: "conf-99", name: "99% Confidence", alpha: 0.01, color: "green" },
    ];

    levels.forEach(({ id, name, alpha, color }) => {
      const z = -Math.log(1 - (1 - alpha) ** (1 / points));
      const data: [number, number][] = [
        [x0, z],
        [x1, z],
      ];

      const existing = this.chartObject.get(id);
      if (existing) {
        (existing as Highcharts.Series).setData(data, true);
      } else {
        this.chartObject.addSeries({
          id,
          name,
          type: "line",
          data,
          color,
          dashStyle: "ShortDash",
          marker: { enabled: false },
          enableMouseTracking: false,
        });
      }
    });
  }


  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  private updateChart(): void {
    this.updateFlag = true;
  }

  private setChartTitle(): void {
    this.chartOptions.title = { text: this.service.getPeriodogramTitle() };
  }

  private setChartXAxis(): void {
    this.chartOptions.xAxis = {
      title: { text: this.service.getPeriodogramXAxisLabel() }
    };
  }

  private setChartYAxis(): void {
    this.chartOptions.yAxis = {
      title: { text: this.service.getPeriodogramYAxisLabel() }
    };
  }
}
