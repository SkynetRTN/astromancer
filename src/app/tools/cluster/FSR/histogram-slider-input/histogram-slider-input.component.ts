import {AfterViewInit, Component, Output} from '@angular/core';
import * as Highcharts from "highcharts";
import HC_histogram from 'highcharts/modules/histogram-bellcurve';
import {ClusterDataService} from "../../cluster-data.service";
import {debounceTime, Subject} from "rxjs";
import {FormControl, FormGroup} from "@angular/forms";

HC_histogram(Highcharts);

@Component({
  selector: 'app-histogram-slider-input',
  templateUrl: './histogram-slider-input.component.html',
  styleUrls: ['./histogram-slider-input.component.scss', '../../../shared/interface/tools.scss']
})
export class HistogramSliderInputComponent implements AfterViewInit {
  Highcharts: typeof Highcharts = Highcharts;
  updateFlag: boolean = true;
  chartConstructor: any = "chart";
  chartObject!: Highcharts.Chart;

  title: string = "Distance";
  unit: string = "kilo-parsec";
  data = this.dataService.getDistance();

  fullDataRange!: range;

  histogramRange!: range;
  histogramBin: number = 10;

  histogramFormGroup: FormGroup;

  dataRange!: range;

  dataFormGroup: FormGroup;
  chartOptions: Highcharts.Options = {
    chart: {
      animation: false,
      styledMode: true,
      marginRight: 10,
    },
    credits: {
      enabled: false,
    },
    title: {
      text: undefined,
    },
    legend: {
      enabled: false,
    },
    xAxis: [{
      alignTicks: false,
      startOnTick: false,
      endOnTick: false,
      type: 'linear',
      tickInterval: 0.5,
    }, {
      visible: false,
    }],
    yAxis: {
      title: {
        text: undefined,
      },
      tickInterval: 100,
      min: 0,
    },
    series: [
      {
        name: '#Stars in Bin',
        type: 'histogram',
        baseSeries: 'data',
      },
      {
        id: 'data',
        type: 'scatter',
        data: this.data,
        visible: false,
        xAxis: 1,
      },
      {
        id: 'areaLeft',
        type: 'area',
        opacity: 0.3,
        data: [],
        threshold: Infinity,
        xAxis: 0,
      },
      {
        id: 'areaRight',
        type: 'area',
        opacity: 0.3,
        data: [],
        threshold: Infinity,
        xAxis: 0,
      }
    ],
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
  private rangeSubject: Subject<range> = new Subject<range>();
  @Output()
  range$ = this.rangeSubject.asObservable();
  private histogramRangeSubject: Subject<range> = new Subject<range>();
  @Output()
  histogramRange$ = this.histogramRangeSubject.asObservable();
  private histogramBinSubject: Subject<number> = new Subject<number>();
  @Output()
  histogramBin$ = this.histogramBinSubject.asObservable();
  private histogramIsLogSubject: Subject<boolean> = new Subject<boolean>();

  constructor(private dataService: ClusterDataService) {
    this.dataService.data$.subscribe(
      () => {
        this.data = this.dataService.getDistance();
        this.updateHistogramRange();
        this.updateHistogramBin(this.histogramBin);
        this.updateArea();
        this.updateXAxis();
        this.resetInputValues();
      }
    );
    this.setExtremes();
    this.histogramFormGroup = new FormGroup({
      sliderMin: new FormControl(this.histogramRange.min),
      sliderMax: new FormControl(this.histogramRange.max),
      inputMin: new FormControl(this.histogramRange.min),
      inputMax: new FormControl(this.histogramRange.max),
      bin: new FormControl(this.histogramBin),
    });
    this.dataFormGroup = new FormGroup({
      sliderMin: new FormControl(this.dataRange.min),
      sliderMax: new FormControl(this.dataRange.max),
      inputMin: new FormControl(this.dataRange.min),
      inputMax: new FormControl(this.dataRange.max),
    });
    this.linkHistogramSliderInput();
    this.linkDataSliderInput();
    this.histogramFormGroup.controls['bin'].valueChanges.pipe(
      debounceTime(25)
    ).subscribe(
      (value) => {
        if (value > 0) {
          this.updateHistogramBin(value);
        } else if (value < 1) {
          this.updateHistogramBin(1);
          this.histogramFormGroup.controls['bin'].setValue(1);
        }
      }
    );
  }

  ngAfterViewInit(): void {
    this.updateHistogramRange();
    this.updateHistogramBin(10);
    this.updateArea();
  }

  chartInitialized($event: Highcharts.Chart) {
    this.chartObject = $event;
  }

  private updateArea(): void {
    const data = {
      left: [
        [this.fullDataRange.min, -10],
        [this.dataRange.min, -10],
      ], right: [
        [this.dataRange.max, -10],
        [this.fullDataRange.max, -10],
      ]
    };
    this.chartObject.series[2].setData(data.left);
    this.chartObject.series[3].setData(data.right);
  }

  private setExtremes() {
    let min: number;
    let max: number;
    if (this.data.length > 0) {
      min = this.data[0] < 0 ? 0 : this.data[0];
      max = this.data[this.data.length - 1];
    } else {
      min = 0;
      max = 1;
    }
    this.fullDataRange = {min: min, max: max};
    this.histogramRange = {min: min, max: max};
    this.dataRange = {min: min, max: max};
  }

  private resetInputValues() {
    this.histogramFormGroup.controls['sliderMin'].setValue(this.histogramRange.min, {emitEvent: false});
    this.histogramFormGroup.controls['sliderMax'].setValue(this.histogramRange.max, {emitEvent: false});
    this.histogramFormGroup.controls['inputMin'].setValue(this.histogramRange.min, {emitEvent: false});
    this.histogramFormGroup.controls['inputMax'].setValue(this.histogramRange.max, {emitEvent: false});
    this.dataFormGroup.controls['sliderMin'].setValue(this.histogramRange.min, {emitEvent: false});
    this.dataFormGroup.controls['sliderMax'].setValue(this.histogramRange.max, {emitEvent: false});
    this.dataFormGroup.controls['inputMin'].setValue(this.histogramRange.min, {emitEvent: false});
    this.dataFormGroup.controls['inputMax'].setValue(this.histogramRange.max, {emitEvent: false});
  }

  private updateHistogramBin(value: number) {
    this.chartObject.series[0].update(
      {
        name: '#Stars in Bin',
        type: 'histogram',
        baseSeries: 'data',
        pointPlacement: 'on',
        binsNumber: value > 0 ? value : 10,
      });
  }

  private updateHistogramRange() {
    this.updateXAxis();
    let plotData = this.data;
    plotData = plotData.filter((point) => {
      return point >= this.histogramRange.min && point <= this.histogramRange.max;
    });
    if (plotData.length !== 0) {
      this.chartObject.series[1].setData(plotData);
    }
  }

  private updateXAxis() {
    this.chartObject.xAxis[0].setExtremes(this.histogramRange.min,
      this.histogramRange.max);
  }

  private setHistogramRange(source: formSource) {
    if (source === formSource.SLIDER) {
      this.histogramRange = {
        min: this.histogramFormGroup.controls['sliderMin'].value!,
        max: this.histogramFormGroup.controls['sliderMax'].value!,
      }
      this.histogramFormGroup.controls['inputMin'].setValue(this.histogramRange.min, {emitEvent: false});
      this.histogramFormGroup.controls['inputMax'].setValue(this.histogramRange.max, {emitEvent: false});
    } else if (source === formSource.INPUT) {
      let inputMin = this.histogramFormGroup.controls['inputMin'].value;
      let inputMax = this.histogramFormGroup.controls['inputMax'].value;
      if (inputMin == null || inputMax == null)
        return;
      let overRide = false;
      if (inputMin < this.fullDataRange.min) {
        inputMin = this.fullDataRange.min
        overRide = true;
      }
      if (inputMax > this.fullDataRange.max) {
        inputMax = this.fullDataRange.max
        overRide = true;
      }
      if (inputMin > inputMax) {
        inputMin = this.fullDataRange.min;
        inputMax = this.fullDataRange.max
        overRide = true;
      }
      this.histogramRange = {min: inputMin, max: inputMax};
      this.histogramFormGroup.controls['sliderMin'].setValue(this.histogramRange.min, {emitEvent: false});
      this.histogramFormGroup.controls['sliderMax'].setValue(this.histogramRange.max, {emitEvent: false});
      if (overRide) {
        this.histogramFormGroup.controls['inputMin'].setValue(this.histogramRange.min, {emitEvent: false});
        this.histogramFormGroup.controls['inputMax'].setValue(this.histogramRange.max, {emitEvent: false});
      }
    }
    if (this.histogramRange.min > this.dataRange.min || this.histogramRange.max < this.dataRange.max) {
      this.setDataRange(formSource.HISTOGRAM);
    }
    this.updateHistogramRange();
    this.updateHistogramBin(this.histogramBin);
    this.histogramRangeSubject.next(this.histogramRange);
  }

  private linkHistogramSliderInput() {
    this.histogramFormGroup.controls['sliderMin'].valueChanges.subscribe(
      () => {
        this.setHistogramRange(formSource.SLIDER);
      });
    this.histogramFormGroup.controls['sliderMax'].valueChanges.subscribe(
      () => {
        this.setHistogramRange(formSource.SLIDER);
      });
    this.histogramFormGroup.controls['inputMin'].valueChanges.subscribe(
      () => {
        this.setHistogramRange(formSource.INPUT);
      });
    this.histogramFormGroup.controls['inputMax'].valueChanges.subscribe(
      () => {
        this.setHistogramRange(formSource.INPUT);
      });
  }

  private setDataRange(source: formSource) {
    if (source === formSource.SLIDER) {
      this.dataRange = {
        min: this.dataFormGroup.controls['sliderMin'].value,
        max: this.dataFormGroup.controls['sliderMax'].value,
      }
      this.dataFormGroup.controls['inputMin'].setValue(this.dataRange.min, {emitEvent: false});
      this.dataFormGroup.controls['inputMax'].setValue(this.dataRange.max, {emitEvent: false});
    } else if (source === formSource.INPUT) {
      const inputMin = this.dataFormGroup.controls['inputMin'].value;
      const inputMax = this.dataFormGroup.controls['inputMax'].value;
      this.dataRange = {
        min: inputMin >= this.histogramRange.min ? inputMin : this.histogramRange.min,
        max: inputMax <= this.histogramRange.max ? inputMax : this.histogramRange.max,
      }
      this.dataFormGroup.controls['sliderMin'].setValue(this.dataRange.min, {emitEvent: false});
      this.dataFormGroup.controls['sliderMax'].setValue(this.dataRange.max, {emitEvent: false});
      if (inputMin < this.histogramRange.min) {
        this.dataFormGroup.controls['inputMin'].setValue(this.histogramRange.min, {emitEvent: false});
      }
      if (inputMax > this.histogramRange.max) {
        this.dataFormGroup.controls['inputMax'].setValue(this.histogramRange.max, {emitEvent: false});
      }
    } else if (source === formSource.HISTOGRAM) {
      if (this.histogramRange.min > this.dataRange.min) {
        this.dataRange.min = this.histogramRange.min;
        this.dataFormGroup.controls['sliderMin'].setValue(this.dataRange.min, {emitEvent: false});
        this.dataFormGroup.controls['inputMin'].setValue(this.dataRange.min, {emitEvent: false});
      } else if (this.histogramRange.max < this.dataRange.max) {
        this.dataRange.max = this.histogramRange.max;
        this.dataFormGroup.controls['sliderMax'].setValue(this.dataRange.max, {emitEvent: false});
        this.dataFormGroup.controls['inputMax'].setValue(this.dataRange.max, {emitEvent: false});
      }
    }
    this.updateArea();
  }

  private linkDataSliderInput() {
    this.dataFormGroup.controls['sliderMin'].valueChanges.pipe(
      debounceTime(25)
    ).subscribe(
      () => {
        this.setDataRange(formSource.SLIDER);
      });
    this.dataFormGroup.controls['sliderMax'].valueChanges.pipe(
      debounceTime(25)
    ).subscribe(
      () => {
        this.setDataRange(formSource.SLIDER);
      });
    this.dataFormGroup.controls['inputMin'].valueChanges.pipe(
      debounceTime(25)
    ).subscribe(
      () => {
        this.setDataRange(formSource.INPUT);
      });
    this.dataFormGroup.controls['inputMax'].valueChanges.pipe(
      debounceTime(25)
    ).subscribe(
      () => {
        this.setDataRange(formSource.INPUT);
      });
  }
}

export enum formSource {
  SLIDER = 0,
  INPUT = 1,
  HISTOGRAM = 2,
}

export interface range {
  min: number,
  max: number
}
