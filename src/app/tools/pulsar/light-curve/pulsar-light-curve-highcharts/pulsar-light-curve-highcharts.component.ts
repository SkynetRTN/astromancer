import { AfterViewInit, Component, Output, ElementRef, OnDestroy, ViewChild, EventEmitter } from '@angular/core';
import * as Highcharts from 'highcharts';
import { Subject, takeUntil } from 'rxjs';
import { PulsarService } from '../../pulsar.service';

@Component({
  selector: 'app-pulsar-light-curve-highcharts',
  templateUrl: './pulsar-light-curve-highcharts.component.html',
  styleUrls: ['./pulsar-light-curve-highcharts.component.scss']
})
export class PulsarLightCurveHighchartsComponent implements AfterViewInit, OnDestroy {
    dt: number = 3;
    chartData: any[] = this.pulsarService.getData();
    
    
  Highcharts: typeof Highcharts = Highcharts;
  updateFlag: boolean = true;
  chartConstructor: any = "chart";
  chartObject!: Highcharts.Chart;

  @Output() chartUpdated = new EventEmitter<any>();

  chartOptions: Highcharts.Options = {
    chart: {
      animation: false,
      styledMode: true,
    },
    title: {
      text: '' // Placeholder, dynamically updated
    },
    legend: {
      enabled: false,
    },
    tooltip: {
      enabled: true,
      shared: false,
    },
    xAxis: {
      title: {
        text: '' // Placeholder, dynamically updated
      },
    },
    yAxis: {
      title: {
        text: '' // Placeholder, dynamically updated
      },
    },
    series: [{
        name: 'Channel 1',
        type: 'line',
        data: [], // Placeholder, dynamically updated
        marker: {
            enabled: true,
            radius: 4,
            symbol: 'circle',
            },
      }, {
        name: 'Channel 2',
        type: 'line',
        data: [], // Placeholder, dynamically updated
        marker: {  
            enabled: true,
            radius: 4,
            symbol: 'triangle',
            },
      }],
      exporting: {
        buttons: {
          contextButton: {
            enabled: false,
          },
          sonifyButton: {
            text: 'Sonify',
            onclick: () => {
              this.chartObject.sonify();
            },
          }
        }
      },
      sonification: {
        enabled: true,
        events: {
          onSeriesStart: (e: any) => {
            this.chartObject.sonification?.speak(
              `Series ${e['series']['name']}`)
          }
        }
      },
  };

  private destroy$: Subject<any> = new Subject<any>();

  constructor(private pulsarService: PulsarService) {}

  ngAfterViewInit(): void {
    this.onBackgroundScaleChange();
    this.initializeChart();

    // React to chart info updates
    this.pulsarService.chartInfo$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.updateChartOptions();
    });

/*    // React to data updates
    this.pulsarService.data$.pipe(
      takeUntil(this.destroy$)
    ).subscribe((data) => {
      console.log('Raw data:', data); // Debugging log
    
      // Filter out invalid data (null values)
      const filteredData = data
        .filter(item => item.frequency !== null && item.channel1 !== null) // Exclude null values
        .map(item => ({ frequency: item.frequency!, intensity: item.channel1! })); // Assert non-null
    
      console.log('Filtered data:', filteredData); // Debugging log
    
      this.updateChartData(filteredData);
    });*/

    // Subscribe to chart info changes


      // Subscribe to background scale changes
      this.pulsarService.backgroundScale$.pipe().subscribe((newScale) => {
        this.dt = newScale;
        console.log('Background scale:', this.dt); // Debugging log
        this.onBackgroundScaleChange();
        this.updateChartData(this.chartData);
      });
  
      // Subscribe to data changes
      this.pulsarService.data$.pipe(
        takeUntil(this.destroy$)
      ).subscribe(data => {
        this.chartData = data;
        this.onBackgroundScaleChange();
        console.log('Data:'); // Debugging log
        this.updateChartData(this.chartData);
        this.dt = this.pulsarService.getBackgroundScale();
        this.onBackgroundScaleChange();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  private initializeChart(): void {
    // Initialize the chart with default options
    this.pulsarService.setHighChart(this.chartObject);
  }

  private updateChartOptions(): void {  
    // Update chart titles and axis labels from the service
    this.chartObject.setTitle({ text: this.pulsarService.getChartTitle() });
    this.chartObject.xAxis[0].setTitle({ text: this.pulsarService.getXAxisLabel() });
    this.chartObject.yAxis[0].setTitle({ text: this.pulsarService.getYAxisLabel() });

    // Update series names
    this.chartObject.series[0].name= 'Channel 1';
    this.chartObject.series[1].name = 'Channel 2';
  }

  private updateChartData(data: { frequency: number, channel1: number, channel2: number }[]): void {
    if (this.chartObject && this.chartObject.series.length > 0) {
        const channel1Data = this.chartData.map(item => [item.frequency, item.channel1]);
        const channel2Data = this.chartData.map(item => [item.frequency, item.channel2]);
        this.chartObject.series[0].setData(channel1Data, true);
        this.chartObject.series[1].setData(channel2Data, true);
      } else {
      // Add a new series if none exists
      this.chartObject.addSeries({
        name: this.pulsarService.getDataLabel(),
        type: 'line',
        data: this.chartData,
        marker: {
          enabled: true,
          radius: 4,
          symbol: 'circle',
        },
        lineWidth: 1.5,
      });
    }
  }

  chartInitialized($event: Highcharts.Chart) {
    this.chartObject = $event; // Use the instance passed from (chartInstance)
    this.pulsarService.setHighChart(this.chartObject);
  
    // Set initial chart data
    const initialData = this.pulsarService.resetData()
    // this.updateChartData(initialData);
  }  

  onBackgroundScaleChange(): void {
    console.log('Background scale change logic executed');
    this.chartData = this.pulsarService.getData();
    const frequency = this.chartData.map(item => item.frequency);
    const channel1 = this.chartData.map(item => item.channel1);
    const channel2 = this.chartData.map(item => item.channel2);
    const subtractedchannel1 = this.backgroundSubtraction(frequency, channel1, this.dt);
    const subtractedchannel2 = this.backgroundSubtraction(frequency, channel2, this.dt);
    this.chartData = this.chartData.map((item, index) => ({
        ...item,
        channel1: subtractedchannel1[index],
        channel2: subtractedchannel2[index],
      }));     
      this.updateChartData(this.chartData);
      }

      median(arr: number[]) {
        arr = arr.filter(num => !isNaN(num));
        const mid = Math.floor(arr.length / 2);
        const nums = arr.sort((a, b) => a - b);
        return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
}


    backgroundSubtraction(frequency: number[], flux: number[], dt: number): number[] {
    let n = Math.min(frequency.length, flux.length);
    const subtracted = [];

    let jmin = 0;
    let jmax = 0;
    for (let i = 0; i < n; i++) {
        while (jmin < n && frequency[jmin] < frequency[i] - (dt / 2)) {
            jmin++;
        }
        while (jmax < n && frequency[jmax] <= frequency[i] + (dt / 2)) {
            jmax++;
        }
        let fluxmed = this.median(flux.slice(jmin, jmax));
        subtracted.push(flux[i] - fluxmed);
    }
    return subtracted;
}

}
