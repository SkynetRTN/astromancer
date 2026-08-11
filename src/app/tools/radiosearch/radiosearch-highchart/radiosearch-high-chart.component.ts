import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import * as Highcharts from 'highcharts';
import { RadioSearchHighChartService } from '../radiosearch.service';
import { Subject, takeUntil } from 'rxjs';

/** Series slots, created once and thereafter updated in place. */
const SERIES_ACTUAL = 0;
const SERIES_FIT = 1;
const SERIES_TARGET = 2;

@Component({
  selector: 'app-radiosearch-highchart',
  templateUrl: './radiosearch-high-chart.component.html',
  styleUrls: ['./radiosearch-high-chart.component.scss']
})
export class RadioSearchHighChartComponent implements AfterViewInit, OnDestroy {
  Highcharts: typeof Highcharts = Highcharts;
  updateFlag: boolean = true;
  paramData: [number, string, string][] | null = null;

  chartConstructor: string = "chart";
  chartObject!: Highcharts.Chart;

  chartOptions: Highcharts.Options = {
    chart: {
      animation: false,
      styledMode: true,
    },
    title: {
      useHTML: true  // the title carries a SIMBAD link
    },
    legend: {
      align: 'center',
    },
    credits: {
      enabled: false,
    },
    tooltip: {
      enabled: true,
      // Not shared: the target-frequency series is a two-point vertical marker,
      // and a shared tooltip pulls its endpoints in alongside the real data.
      shared: false,
      headerFormat: '<span class="highcharts-header">{series.name}</span><br/>',
      pointFormat: '{point.x:.1f} MHz, {point.y:.3f} Jy',
    },
    exporting: {
      buttons: {
        contextButton: {
          enabled: false,
        }
      }
    },
    xAxis: {
      type: 'logarithmic',
    },
    yAxis: {
      type: 'logarithmic',
    }
  };

  private destroy$: Subject<any> = new Subject<any>();

  constructor(private service: RadioSearchHighChartService) {
    this.setChartTitle();
    this.setChartXAxis();
    this.setChartYAxis();
  }

  chartInitialized($event: Highcharts.Chart) {
    this.chartObject = $event;
    this.service.setHighChart(this.chartObject);
  }

  ngAfterViewInit(): void {
    this.initSeries();

    this.service.chartInfo$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.setChartXAxis();
      this.setChartYAxis();
      this.setChartTitle();
      this.updateChart();
    });

    this.service.data$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.updateSeries();
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
    const titleText = this.service.getChartTitle();

    let clickablePart = '';

    if (this.paramData?.[0]) {
      const [, catalog, identifier] = this.paramData[0];
      const linkText = `${catalog} ${identifier}`.trim();

      if (linkText) {
        const ident = encodeURIComponent(`${catalog} ${identifier}`.trim());
        const hyperlink = `https://simbad.cds.unistra.fr/simbad/sim-id?Ident=${ident}`
          + `&NbIdent=1&Radius=2&Radius.unit=arcmin&submit=submit+id`;
        clickablePart = ` <a class="simbad-link" href="${hyperlink}" target="_blank"`
          + ` rel="noopener">${linkText}</a>`;
      }
    }

    this.chartOptions.title = {
      text: `${titleText}${clickablePart}`,
      useHTML: true
    };
  }

  /**
   * Create the three series once.
   *
   * These used to be destroyed and re-added on every data emission, which is
   * what made the redraw look jumpy and forced the explicit animation blocks.
   */
  private initSeries(): void {
    if (!this.chartObject) {
      return;
    }

    while (this.chartObject.series.length) {
      this.chartObject.series[0].remove(false);
    }

    this.chartObject.addSeries({
      name: 'Actual',
      type: 'scatter',
      data: [],
      marker: { enabled: true, symbol: 'circle', radius: 4 },
    }, false);

    this.chartObject.addSeries({
      name: 'Fit',
      type: 'line',
      data: [],
      marker: { enabled: false },
    }, false);

    this.chartObject.addSeries({
      name: 'Target Frequency',
      type: 'line',
      data: [],
      marker: { enabled: false },
    }, false);

    this.chartObject.redraw();
  }

  private updateSeries(): void {
    if (!this.chartObject || this.chartObject.series.length < 3) {
      this.initSeries();
      if (!this.chartObject) {
        return;
      }
    }

    const frequencyFluxData = this.processData(this.service.getDataArray());
    this.paramData = this.processParamData(this.service.getParamDataArray());

    const actualData = frequencyFluxData.map((point) => ({ x: point[0], y: point[1] }));
    const fitData = frequencyFluxData.map((point) => ({
      x: point[0],
      y: parseFloat(point[2].toFixed(1)),
    }));

    // On initial load (and any time the user hasn't selected a source yet),
    // actualData and paramData are both empty after the > 0 filters. Clear the
    // series instead of crashing on paramData[0][0] or an empty Math.min/max.
    if (actualData.length === 0 || !this.paramData[0]) {
      this.chartObject.series[SERIES_ACTUAL].setData([], false);
      this.chartObject.series[SERIES_FIT].setData([], false);
      this.chartObject.series[SERIES_TARGET].setData([], false);
      this.setChartTitle();
      this.chartObject.redraw();
      return;
    }

    const yValues = actualData.map((point) => point.y);
    const minY = Math.min(...yValues);
    const maxY = Math.max(...yValues);

    const targetFrequency = this.paramData[0][0];
    const targetLine = [
      { x: Number(targetFrequency.toFixed(3)), y: Number((minY * 1000).toFixed(3)) },
      { x: Number(targetFrequency.toFixed(3)), y: Number((maxY / 1000).toFixed(3)) },
    ];

    // The interpolated point sits on the target frequency; it is drawn by the
    // marker series rather than duplicated in the measured data.
    const measuredData = actualData.filter((point) => point.x !== targetFrequency);

    this.chartObject.series[SERIES_ACTUAL].setData(measuredData, false);
    this.chartObject.series[SERIES_FIT].setData(fitData, false);
    this.chartObject.series[SERIES_TARGET].setData(targetLine, false);

    // Set extremes on the axis rather than replacing chartOptions.yAxis - the
    // old code assigned a fresh literal that dropped `type: 'logarithmic'`,
    // silently turning the axis linear once data arrived.
    this.chartObject.yAxis[0].setExtremes(minY * 0.8, maxY * 1.05, false);

    this.setChartTitle();
    this.chartObject.update({ title: this.chartOptions.title }, false);
    this.chartObject.redraw();
  }

  private setChartXAxis(): void {
    this.chartOptions.xAxis = {
      title: { text: this.service.getXAxisLabel() },
      type: 'logarithmic',
    };
  }

  private setChartYAxis(): void {
    this.chartOptions.yAxis = {
      title: { text: this.service.getYAxisLabel() },
      type: 'logarithmic',
    };
  }

  private processData(data: number[][]): number[][] {
    return data.filter((value: number[]) => {
      return value[0] > 0 && value[1] > 0; // Exclude non-positive values
    }).sort((a: number[], b: number[]) => {
      return a[0] - b[0];
    });
  }

  private processParamData(data: [number, string, string][]): [number, string, string][] {
    return data.filter(([targetFreq]) => {
      return targetFreq > 0;
    }).sort(([a], [b]) => a - b);
  }
}
