import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from "rxjs";
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
    const bins = 100; 

    const binnedData1 = this.service.binData(data['data'], bins);
    
    this.chartObject.addSeries({
      name: 'Source 1', 
      data: binnedData1,
      type: 'line',
      marker: {
        symbol: 'circle',
        radius: 2,
      }
    });
  
    const sum = data['data2'].reduce((total, pair) => total + pair[1], 0);
    if (sum != 0) {
      const calibration = this.service.getPeriodFoldingCal();
      const adjustedData2 = data['data2'].map(point => [point[0], point[1] * calibration]);
  
      const binnedData2 = this.service.binData(adjustedData2, bins);
  
      this.chartObject.addSeries({
        name: 'Source 2', 
        data: binnedData2,
        type: 'line',
        color: 'purple',
        marker: {
          symbol: 'circle',
          radius: 2,
        }
      });
    }
  }  
  

  updateData() {  
    const data = this.service.getPeriodFoldingChartData();
    const displayPeriod = Number(this.service.getPeriodFoldingDisplayPeriod());
    const period = Number(this.service.getPeriodFoldingPeriod());
    const phase = Number(this.service.getPeriodFoldingPhase());
    
    if (data['data2']) {
      const bins = 100; 
  
      const binnedData1 = this.service.binData(data['data'], bins);

      const phaseRolledData1 = binnedData1.map(([x, y]) => {
        const shifted = x + (phase * period);
        const rolled = shifted >= period * displayPeriod? shifted - period * displayPeriod : shifted;
        return [rolled, y];
      });
      
      this.chartObject.series[0].setData(phaseRolledData1);

      const calibration = this.service.getPeriodFoldingCal();
      const adjustedData2 = data['data2'].map(point => [point[0], point[1] * calibration]);

      const binnedData2 = this.service.binData(adjustedData2, bins);
      const phaseRolledData2 = binnedData2.map(([x, y]) => {
        const shifted = x + (phase * period);
        const rolled = shifted > period * displayPeriod ? shifted - period * displayPeriod : shifted;
        return [rolled, y];
      });
      
  
      if (this.chartObject.series.length < 2) {
        this.chartObject.addSeries({
          name: 'Source 2',
          data: phaseRolledData2,
          type: 'line',
          marker: {
            symbol: 'circle',
            radius: 2,
          }
        });
      } else {
        this.chartObject.series[1].setData(phaseRolledData2);
      }
    } else if (this.chartObject.series.length > 1) {
      this.chartObject.series[1].remove();
    }

    const sum = data['data2'].reduce((sum, item) => sum + item[1], 0) === 0;
    
    if (sum) {
      const initialData = this.service.getData()
      .filter(item => item.jd !== null && item.source1 !== null)
      .map(item => ({ frequency: item.jd!, channel1: item.source1!, channel2: item.source2!}));

      const chartData = initialData.map(item => {
        const rawX = (item.frequency / initialData.length) * period + (period * phase);
        const wrappedX = ((rawX % period) + period) % period;
        return [wrappedX, item.channel1];
      });

      if (displayPeriod == 2) {
        const secondCycle = chartData.map(([x, y]) => [x + period, y]);
        const finalChartData = [...chartData, ...secondCycle];

        this.chartObject.series[0].setData(finalChartData, true);
      } else {
        this.chartObject.series[0].setData(chartData, true);
      }

      if (this.chartObject.series.length > 1) { 
        this.chartObject.series[1].remove();
      }
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
