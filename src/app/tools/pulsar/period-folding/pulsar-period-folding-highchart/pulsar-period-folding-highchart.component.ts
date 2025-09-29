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

  setData() {
    const data = this.service.getPeriodFoldingChartData();
    const bins = this.service.getPeriodFoldingBins() * parseInt(this.service.getPeriodFoldingDisplayPeriod()); 
    const binnedData1 = this.service.binData(data['data'], bins);

    const sum = data['data2'].reduce((total, pair) => total + pair[1], 0);

    const hasData2 = Array.isArray(data['data2']) &&
                 data['data2'].some(pair => pair[1] !== 0);

    const firstSeriesName = hasData2 ? 'Polarization XX' : 'Data';
    
    this.chartObject.addSeries({
      name: firstSeriesName, 
      data: binnedData1,
      type: 'line',
      marker: {
        enabled: false,
      }
    });
  
    if (sum != 0) {
      const calibration = this.service.getPeriodFoldingCal();
      const adjustedData2 = data['data2'].map(point => [point[0], point[1] * calibration]);
  
      const binnedData2 = this.service.binData(adjustedData2, bins);
  
      this.chartObject.addSeries({
        name: 'Polarization YY', 
        data: binnedData2,
        type: 'line',
        marker: {
          enabled: false,
        }
      });

      const diffData = binnedData1.map((point, i) => {
        const x = point[0];
        const yDiff = point[1] - binnedData2[i][1];
        return [x, yDiff];
      });
      diffData.sort((a, b) => a[0] - b[0]);

      this.chartObject.addSeries({
        name: 'Difference', 
        data: diffData,
        type: 'line',
        visible: false,
        connectEnds: false,
        marker: {
          enabled: false,
        }
      });     
      
      const sumData = binnedData1.map((point, i) => {
        const x = point[0];
        const yDiff = point[1] + binnedData2[i][1];
        return [x, yDiff];
      });
      sumData.sort((a, b) => a[0] - b[0]);

      this.chartObject.addSeries({
        name: 'Sum', 
        data: sumData,
        type: 'line',
        visible: false,
        connectEnds: false,
        marker: {
          enabled: false,
        }
      });
    } 
  }  
  

  updateData() {
    const data = this.service.getPeriodFoldingChartData();
    const displayPeriod = Number(this.service.getPeriodFoldingDisplayPeriod());
    const period = Number(this.service.getPeriodFoldingPeriod());
    const phase = Number(this.service.getPeriodFoldingPhase());

    // Helper: fold, wrap, bin
    // const foldAndBin = (points: [number, number][], binsPerPeriod: number): [number, number][] => {
    //   const shiftedWrapped = points.map(([x, y]) => {
    //     const shifted = x + (phase * period);
    //     const wrappedX = ((shifted % period) + period) % period; // always in [0, period)
    //     return [wrappedX, y] as [number, number];
    //   });
    //   shiftedWrapped.sort((a, b) => a[0] - b[0]);
    //   return this.service.binData(shiftedWrapped, binsPerPeriod) as [number, number][];
    // };

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

      // Main dataset
      const binnedData1 = foldAndBin(data['data'] as [number, number][], binsPerPeriod);
      const finalData1 = duplicateIfNeeded(binnedData1);

      // Secondary dataset (apply calibration)
      const calibration = this.service.getPeriodFoldingCal();
      const adjustedData2 = (data['data2'] as [number, number][])
        .map(([x, y]) => [x, y * calibration] as [number, number]);
      const binnedData2 = foldAndBin(adjustedData2, binsPerPeriod);
      const finalData2 = duplicateIfNeeded(binnedData2);

      // Update chart
      this.chartObject.series[0].setData(finalData1);
      this.chartObject.series[0].update({ type: 'line', marker: { enabled: false} }, false);

      this.chartObject.series[1].setData(finalData2);
      this.chartObject.series[1].update({ type: 'line', marker: { enabled: false} }, false);

      // Difference dataset
      const n = Math.min(finalData1.length, finalData2.length);
      const diffData: [number, number][] = [];
      for (let i = 0; i < n; i++) {
        diffData.push([finalData1[i][0], finalData1[i][1] - finalData2[i][1]]);
      }
      diffData.sort((a, b) => a[0] - b[0]);

      const sumData: [number, number][] = [];
      for (let i = 0; i < n; i++) {
        sumData.push([finalData1[i][0], finalData1[i][1] + finalData2[i][1]]);
      }
      sumData.sort((a, b) => a[0] - b[0]);

      this.chartObject.series[2].setData(diffData);
      this.chartObject.series[2].update({ type: 'line', marker: { enabled: false} }, false);

      this.chartObject.series[3].setData(sumData);
      this.chartObject.series[3].update({ type: 'line', marker: { enabled: false} }, false);

      this.chartObject.redraw?.();

    } else {
      // --- Case B: only main dataset present ---
      if (this.chartObject.series.length > 2) {
        this.chartObject.series[1].remove();
        this.chartObject.series[2].remove();
      } else if (this.chartObject.series.length > 1) {
        this.chartObject.series[1].remove();
      }

      const initialData = this.service.getData()
        .filter(item => item.jd !== null && item.source1 !== null)
        .map(item => ({ frequency: item.jd!, channel1: item.source1!, channel2: item.source2! }));

      const chartData: [number, number][] = initialData.map(item => {
        const rawX = (item.frequency / initialData.length) * period + (period * phase);
        const wrappedX = ((rawX % period) + period) % period;
        return [wrappedX, item.channel1] as [number, number];
      });

      const finalChartData = duplicateIfNeeded(chartData);

      this.chartObject.series[0].setData(finalChartData);
      this.chartObject.series[0].update({ name: 'Data', type: 'line', marker: { enabled: false} });

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
