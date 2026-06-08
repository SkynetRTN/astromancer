import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { first, Subject, takeUntil } from "rxjs";
import { PulsarService } from "../../pulsar.service";
import * as Highcharts from 'highcharts';
import More from "highcharts/highcharts-more";
import { PulsarDisplayPeriod } from '../../pulsar.service.util';

@Component({
  selector: 'app-pulsar-period-folding-highchart',
  templateUrl: './pulsar-period-folding-highchart.component.html',
  styleUrls: ['./pulsar-period-folding-highchart.component.scss']
})
export class PulsarPeriodFoldingHighchartComponent implements AfterViewInit, OnDestroy {
  Highcharts: typeof Highcharts = Highcharts;
  updateFlag: boolean = true;
  chartConstructor: any = "chart";
  chartObject!: Highcharts.Chart;
  chartOptions: Highcharts.Options = {
    chart: {
      animation: false,
      styledMode: true,
      zooming: {
        type: 'x',
        key: 'shift',
      },
    },
    yAxis: {
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

  constructor(private service: PulsarService) {
    More(Highcharts);
  }

  ngAfterViewInit() {
    this.setChartTitle();
    this.setChartXAxis();
    this.setChartYAxis();
    this.setData();
    this.updateXAxisScale();
    this.updateChart();

    this.chartObject.setTitle({ text: this.service.getPeriodFoldingTitle() });
    this.chartObject.xAxis[0]?.setTitle({ text: this.service.getPeriodFoldingXAxisLabel() });
    this.chartObject.yAxis[0]?.setTitle({ text: this.service.getPeriodFoldingYAxisLabel() });

    // Handle form changes
    this.service.periodFoldingForm$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.setChartTitle();
      this.setChartXAxis();
      this.setChartYAxis();
      this.updateChart();
    });

    // Handle data updates
    this.service.periodFoldingData$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.updateData();
      this.updateXAxisScale();
      this.updateChart();
    });
  }

  chartInitialized($event: Highcharts.Chart) {
    this.chartObject = $event;
    this.service.setHighChartPeriodFolding(this.chartObject);
  }

  // Stable series IDs so updateData can look them up rather than relying on
  // a fixed series[0..3] ordering. Index-based access used to crash when the
  // chart was initialized single-source and later received dual-source data.
  private readonly SERIES_DATA1 = 'pf-data1';
  private readonly SERIES_DATA2 = 'pf-data2';
  private readonly SERIES_DIFF  = 'pf-diff';
  private readonly SERIES_SUM   = 'pf-sum';

  private upsertSeries(options: Highcharts.SeriesOptionsType & { id: string }): void {
    const existing = this.chartObject.get(options.id) as Highcharts.Series | undefined;
    if (existing) {
      // Strip data from the options before update() — leaving it in causes
      // Highcharts to run a second data merge via oneToOne=false matching
      // against the prior point set, which can leave behind stale anchor
      // points that visually "close" the line back to the start.
      const { data, ...optionsWithoutData } = options as any;
      existing.update(optionsWithoutData, false);
      existing.setData(data ?? [], false);
    } else {
      this.chartObject.addSeries(options, false);
    }
  }

  private removeSeriesById(id: string): void {
    const existing = this.chartObject.get(id) as Highcharts.Series | undefined;
    if (existing) existing.remove(false);
  }

  setData() {
    const data = this.service.getPeriodFoldingChartData();
    const bins = this.service.getPeriodFoldingBins() * parseInt(this.service.getPeriodFoldingDisplayPeriod());
    const binnedData1 = this.service.binData(data['data'], bins);

    // getPeriodFoldingChartData() omits data2 when source2 is absent — guard
    // both the reduce and the hasData2 check so the chart doesn't throw on
    // single-source files.
    const data2 = data['data2'];
    const sum = data2 ? data2.reduce((total, pair) => total + pair[1], 0) : 0;
    const hasData2 = Array.isArray(data2) && data2.some(pair => pair[1] !== 0);

    this.upsertSeries({
      id: this.SERIES_DATA1,
      name: hasData2 ? 'Polarization XX' : 'Data',
      data: binnedData1,
      type: 'line',
      marker: { enabled: false },
    });

    if (sum != 0 && data2) {
      const calibration = this.service.getPeriodFoldingCal();
      const adjustedData2 = data2.map(point => [point[0], point[1] * calibration]);
      const binnedData2 = this.service.binData(adjustedData2, bins);

      this.upsertSeries({
        id: this.SERIES_DATA2,
        name: 'Polarization YY',
        data: binnedData2,
        type: 'line',
        marker: { enabled: false },
      });

      const diffData = binnedData1.map((point, i) => [point[0], point[1] - binnedData2[i][1]]);
      diffData.sort((a, b) => a[0] - b[0]);
      this.upsertSeries({
        id: this.SERIES_DIFF,
        name: 'Difference',
        data: diffData,
        type: 'line',
        visible: false,
        connectEnds: false,
        marker: { enabled: false },
      });

      const sumData = binnedData1.map((point, i) => [point[0], point[1] + binnedData2[i][1]]);
      sumData.sort((a, b) => a[0] - b[0]);
      this.upsertSeries({
        id: this.SERIES_SUM,
        name: 'Sum',
        data: sumData,
        type: 'line',
        visible: false,
        connectEnds: false,
        marker: { enabled: false },
      });
    }
    this.chartObject.redraw?.();
  }
  

  updateData() {
    const data = this.service.getPeriodFoldingChartData();
    const displayPeriod = Number(this.service.getPeriodFoldingDisplayPeriod());
    const period = Number(this.service.getPeriodFoldingPeriod());
    const phase = Number(this.service.getPeriodFoldingPhase());

    const foldAndBin = (points: [number, number][], binsPerPeriod: number): [number, number][] => {
      // Step 1: bin first
      const binned = this.service.binData(points, binsPerPeriod) as [number, number][];

      // Step 2: apply phase shift + wrapping
      const shiftedWrapped = binned.map(([x, y]) => {
        const shifted = x + (phase * period);
        const wrappedX = ((shifted % period) + period) % period; // always in [0, period)
        return [wrappedX, y] as [number, number];
      });

      // Step 3: sort for plotting
      shiftedWrapped.sort((a, b) => a[0] - b[0]);

      return shiftedWrapped;
    };

    // Helper: duplicate dataset if displayPeriod == 2
    const duplicateIfNeeded = (arr: [number, number][]): [number, number][] =>
      displayPeriod === 2
        ? [...arr, ...arr.map(([x, y]) => [x + period, y] as [number, number])]
        : arr;

    // Check if data2 is all zeros
    const data2 = data['data2'] as [number, number][] | undefined;

    // sum will be true only if data2 exists and all y values are zero
    const sum = data2 ? data2.reduce((acc, [, y]) => acc + y, 0) === 0 : true;
    
    if (sum === false) {
      // --- Case A: both data and data2 present ---
      const binsPerPeriod = this.service.getPeriodFoldingBins();

      const binnedData1 = foldAndBin(data['data'] as [number, number][], binsPerPeriod);
      const finalData1 = duplicateIfNeeded(binnedData1);

      const calibration = this.service.getPeriodFoldingCal();
      const adjustedData2 = (data['data2'] as [number, number][])
        .map(([x, y]) => [x, y * calibration] as [number, number]);
      const binnedData2 = foldAndBin(adjustedData2, binsPerPeriod);
      const finalData2 = duplicateIfNeeded(binnedData2);

      const n = Math.min(finalData1.length, finalData2.length);
      const diffData: [number, number][] = [];
      const sumData: [number, number][] = [];
      for (let i = 0; i < n; i++) {
        diffData.push([finalData1[i][0], finalData1[i][1] - finalData2[i][1]]);
        sumData.push([finalData1[i][0], finalData1[i][1] + finalData2[i][1]]);
      }
      diffData.sort((a, b) => a[0] - b[0]);
      sumData.sort((a, b) => a[0] - b[0]);

      this.upsertSeries({ id: this.SERIES_DATA1, name: 'Polarization XX', data: finalData1, type: 'line', marker: { enabled: false } });
      this.upsertSeries({ id: this.SERIES_DATA2, name: 'Polarization YY', data: finalData2, type: 'line', marker: { enabled: false } });
      this.upsertSeries({ id: this.SERIES_DIFF,  name: 'Difference',      data: diffData,   type: 'line', visible: false, connectEnds: false, marker: { enabled: false } });
      this.upsertSeries({ id: this.SERIES_SUM,   name: 'Sum',             data: sumData,    type: 'line', visible: false, connectEnds: false, marker: { enabled: false } });

      this.chartObject.redraw?.();

    } else {
      // --- Case B: only main dataset present ---
      // Remove the dual-source series cleanly (Sum used to be left orphaned
      // because series.length-based cleanup never reached series[3]).
      this.removeSeriesById(this.SERIES_DATA2);
      this.removeSeriesById(this.SERIES_DIFF);
      this.removeSeriesById(this.SERIES_SUM);

      const initialData = this.service.getData()
        .filter(item => item.jd !== null && item.source1 !== null)
        .map(item => ({ frequency: item.jd!, channel1: item.source1!, channel2: item.source2! }));

      const chartData: [number, number][] = initialData.map(item => {
        const rawX = (item.frequency / initialData.length) * period + (period * phase);
        const wrappedX = ((rawX % period) + period) % period;
        return [wrappedX, item.channel1] as [number, number];
      });

      // Sort ascending by x before plotting. Without this, time-ordered
      // samples land at non-monotonic wrapped-phase positions and Highcharts
      // draws straight lines back across the period boundary each time the
      // wrapped x jumps from near-period to near-0 — visually identical to
      // "first and last points connecting" in a loop.
      chartData.sort((a, b) => a[0] - b[0]);

      const finalChartData = duplicateIfNeeded(chartData);

      this.upsertSeries({ id: this.SERIES_DATA1, name: 'Data', data: finalChartData, type: 'line', marker: { enabled: false } });

      this.chartObject.redraw?.();
    }
  }

  

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  private updateXAxisScale(): void {
    let p = this.service.getPeriodFoldingPeriod();
    let delta = 0;

    if (p > 4.95) {
      delta = 0.15;
    } else if (p > 0.5) {
      delta = 0.1;
    } else if (p > 0.05) {
      delta = 0.01;
    } else if (p > 0.005) {
      delta = 0.001;
    } else if (p > 0.0005) {
      delta = 0.0001;
    } else if (p > 0.00005) {
      delta = 0.00001;
    } else {
      delta = 0.000001;
    }

    if (p - parseInt(p.toString()) < delta) {
      p = parseInt(p.toString()) + delta;
    }

    if (this.service.getPeriodFoldingDisplayPeriod() === PulsarDisplayPeriod.TWO) {
      p = p * 2;
    }

    this.chartObject.xAxis[0].setExtremes(0, parseFloat(p.toString()));
  }
  
  private updateChart(): void {
    this.updateFlag = true;
  }

  private setChartTitle(): void {
    this.chartOptions.title = { text: this.service.getPeriodFoldingTitle() };
  }

  private setChartXAxis(): void {
    this.chartOptions.xAxis = {
      title: { text: this.service.getPeriodFoldingXAxisLabel() }
    };
  }

  private setChartYAxis(): void {
    this.chartOptions.yAxis = {
      title: { text: this.service.getPeriodFoldingYAxisLabel() },
    };
  }
}
