import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import * as Highcharts from "highcharts";
import { Subject, skip, takeUntil } from "rxjs";
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
    title: {
      text: "Title",
      style: {
        fontWeight: "normal",
        fontSize: "14px"
      }
    },
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
  
    this.chartObject.setTitle({ text: this.service.getPeriodogramTitle() });
    this.chartObject.xAxis[0]?.setTitle({ text: this.service.getPeriodogramXAxisLabel() });
    this.chartObject.yAxis[0]?.setTitle({ text: this.service.getPeriodogramYAxisLabel() });

    this.service.periodogramForm$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.setChartTitle();
      this.setChartXAxis();
      this.setChartYAxis();
      this.updateChart();
    });
    this.service.isComputing$.pipe(
      skip(1),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.updateData();
    });
  }

  chartInitialized($event: Highcharts.Chart) {
    this.chartObject = $event;
    this.service.setHighChartPeriodogram(this.chartObject);
  }

  setData() {
    const periodogramData = this.service.getChartComputedPeriodogramDataArray();

    // Get first series data
    const firstSeriesData = periodogramData[0] as unknown as { x: number; y: number }[];

    // Extract x-values
    const xValues = firstSeriesData.map(point => point.x);

    // Compute min and max
    const start = Math.min(...xValues);
    const end = Math.max(...xValues);

    Object.entries(periodogramData).forEach(([key, data], index) => {
      const numericData: number[] = (data as Number[]).map(n => n.valueOf());

      this.chartObject.addSeries({
        id: `channel-${index}`,
        name: index === 0 ? "Polarization XX" :
              index === 1 ? "Polarization YY" :
              `Channel ${index + 1}`,
        type: "line",
        data: numericData,
        marker: {
          symbol: "circle",
          radius: 3,
        },
      });
    });

    // Add static confidence lines
    this.addConfidenceLines(start, end);
  }

  private findLocalMax(points: [number, number][]): [number, number][] {
      let globalMax = points[0];

      for (let i = 1; i < points.length; i++) {
          if (points[i][1] > globalMax[1]) {
              globalMax = points[i];
          }
      }

      return [globalMax];
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
          name: index === 0 ? "Polarization XX" :
          index === 1 ? "Polarization YY" :
          `Channel ${index + 1}`,
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

    const data1: [number, number][] = periodogramData.data1.map(p => {
      const obj = p as unknown as { x: number; y: number }; 
      return [obj.x, obj.y];
    });
    const data2: [number, number][] | undefined = periodogramData.data2
      ? periodogramData.data2.map(p => {
          const obj = p as unknown as { x: number; y: number };
          return [obj.x, obj.y];
        })
      : undefined;

    const maxima1 = this.findLocalMax(data1);
    const maxima2 = data2 ? this.findLocalMax(data2) : [];

    this.addLocalMaxima(maxima1, maxima2);
  }

  /**
   * Adds or updates horizontal confidence lines.
   */
  private addConfidenceLines(x0: number, x1: number) {
    const points = this.service.getPeriodogramPoints();
    const levels = [
      { id: "conf-1-sigma", name: "67.3% Confidence", alpha: 1-0.673, color: "red" },
      { id: "conf-2-sigma", name: "95.4% Confidence", alpha: 1-0.954, color: "orange" },
      { id: "conf-3-sigma", name: "99.73% Confidence", alpha: 1-0.9973, color: "green" },
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

  private addLocalMaxima(maxima1: [number, number][], maxima2: [number, number][]) {
    const combinedData: [number, number][] = [...maxima1, ...maxima2];

    const seriesId = "global-maxima";
    const existing = this.chartObject.get(seriesId);

    if (existing) {
      (existing as Highcharts.Series).setData(combinedData, true);
    } else {
      this.chartObject.addSeries({
        id: seriesId,
        type: "scatter",
        data: combinedData,
        color: "red",
        showInLegend: true,    
        name: "Global Maxima",
        visible: false,         
        marker: {
          enabled: true,
          radius: 4,
          symbol: "circle"
        },
        enableMouseTracking: false,
        zIndex: 10
      });
    }
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
