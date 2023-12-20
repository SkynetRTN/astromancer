import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import * as Highcharts from "highcharts";
import HC_histogram from 'highcharts/modules/histogram-bellcurve';
import {debounceTime, Subject} from "rxjs";
import {FormControl, FormGroup} from "@angular/forms";

HC_histogram(Highcharts);

@Component({
  selector: 'app-histogram-slider-input',
  templateUrl: './histogram-slider-input.component.html',
  styleUrls: ['./histogram-slider-input.component.scss', '../../../shared/interface/tools.scss']
})
export class HistogramSliderInputComponent implements OnInit, AfterViewInit {
  Highcharts: typeof Highcharts = Highcharts;
  updateFlag: boolean = true;
  chartConstructor: any = "chart";
  chartObject!: Highcharts.Chart;

  @Input()
  title!: string;
  @Input()
  unit!: string;
  @Input()
  $data!: Subject<{ data: number[], isNew: boolean }>;
  @Output()
  $OnInit: EventEmitter<void> = new EventEmitter<void>();
  @Output()
  public $range: EventEmitter<range> = new EventEmitter<range>();
  @Output()
  public $histogramRange: EventEmitter<range> = new EventEmitter<range>();
  @Output()
  public $bin: EventEmitter<number> = new EventEmitter<number>();
  data!: number[];
  fullDataRange!: range;
  histogramRange!: range;
  histogramBin: number = 10;
  histogramFormGroup!: FormGroup;
  dataRange!: range;
  dataFormGroup!: FormGroup;
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
        zIndex: 1,
      },
      {
        id: 'data',
        type: 'scatter',
        data: [],
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
        zIndex: 2,
      },
      {
        id: 'areaRight',
        type: 'area',
        opacity: 0.3,
        data: [],
        threshold: Infinity,
        xAxis: 0,
        zIndex: 2,
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
  private rangeBufferSubject: Subject<range> = new Subject<range>();
  private $rangeBuffer = this.rangeBufferSubject.asObservable();
  private histogramBufferSubject: Subject<range> = new Subject<range>();
  private $histogramBuffer = this.histogramBufferSubject.asObservable();
  private binBufferSubject: Subject<number> = new Subject<number>();
  private $binBuffer = this.binBufferSubject.asObservable();

  constructor() {
    this.initDebounce();
  }

  ngOnInit() {
    this.$data.subscribe(
      (data) => {
        if (this.data === undefined) {
          this.init(data.data);
          this.rangeBufferSubject.next(this.dataRange);
          this.histogramBufferSubject.next(this.histogramRange);
          this.binBufferSubject.next(this.histogramBin);
        } else if (data.isNew) {
          this.data = data.data;
          this.init(data.data);
          // this.setExtremes();
          // this.histogramFormGroup.setValue({
          //   sliderMin: this.histogramRange.min,
          //   sliderMax: this.histogramRange.max,
          //   inputMin: this.histogramRange.min,
          //   inputMax: this.histogramRange.max,
          //   bin: this.histogramBin,
          // });
          // this.dataFormGroup.setValue({
          //   sliderMin: this.dataRange.min,
          //   sliderMax: this.dataRange.max,
          //   inputMin: this.dataRange.min,
          //   inputMax: this.dataRange.max,
          // });
        } else {
          this.data = data.data;
          this.plotHistogram();
        }
      });
    this.$OnInit.emit();
  }

  init(data: number[]) {
    this.data = data;
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
    this.linkDataSliderInput();
    this.linkHistogramSliderInput();
    this.linkBinInput();
  }

  ngAfterViewInit(): void {
    this.plotHistogram();
  }

  chartInitialized($event: Highcharts.Chart) {
    this.chartObject = $event;
  }

  private setExtremes() {
    let min: number;
    let max: number;
    const sigma = 0.9876; // 2.5 sigma
    const lower = Math.ceil(this.data.length * (0.5 - sigma / 2));
    const upper = Math.floor(this.data.length * (0.5 + sigma / 2));
    if (this.data.length > 0) {
      min = this.data[lower];
      max = this.data[upper];
    } else {
      min = 0;
      max = 1;
    }
    this.fullDataRange = {min: min, max: max};
    this.histogramRange = {min: min, max: max};
    this.dataRange = {min: min, max: max};
  }

  private initDebounce() {
    this.$rangeBuffer.pipe(debounceTime(100),).subscribe(
      (range) => {
        this.$range.next(range);
      });
    this.$histogramBuffer.pipe(debounceTime(100),).subscribe(
      (range) => {
        this.$histogramRange.next(range);
      });
    this.$binBuffer.pipe(debounceTime(100),).subscribe(
      (bin) => {
        this.$bin.next(bin);
      });
  }

  private getDefaultBin(plotData?: number[]): number {
    if (plotData == null)
      plotData = this.data;
    if (plotData.length === 0)
      return 10;
    const n = plotData.length;
    const iqr = plotData[Math.floor(n * 0.75)] - plotData[Math.floor(n * 0.25)];
    const binWidth = 2 * iqr * Math.pow(n, -1 / 3);
    return Math.ceil((plotData[plotData.length - 1] - plotData[0]) / binWidth);
  }

  private getPlotData(): number[] {
    let plotData = this.data;
    plotData = plotData.filter((point) => {
      return point >= this.histogramRange.min && point <= this.histogramRange.max;
    });
    return plotData;
  }

  private plotHistogram(bin?: number) {
    if (this.data.length === 0) {
      this.chartObject.series[1].setData([(this.fullDataRange.min + this.fullDataRange.max) / 2]);
      this.chartObject.series[0].update(
        {
          name: '#Stars in Bin',
          type: 'histogram',
          baseSeries: 'data',
          pointPlacement: 'on',
          binsNumber: bin,
        });
      this.updateXAxis();
      return;
    }
    const plotData = this.getPlotData();
    if (bin == null)
      bin = this.getDefaultBin(plotData);
    this.histogramBin = bin;
    this.histogramFormGroup.controls['bin'].setValue(bin, {emitEvent: false});
    this.chartObject.series[1].setData(plotData);
    this.chartObject.series[0].update(
      {
        name: '#Stars in Bin',
        type: 'histogram',
        baseSeries: 'data',
        pointPlacement: 'on',
        binsNumber: bin,
      });
    this.updateXAxis();
  }

  private updateXAxis() {
    this.chartObject.xAxis[0].setExtremes(this.histogramRange.min,
      this.histogramRange.max);
  }

  private linkBinInput() {
    this.histogramFormGroup.controls['bin'].valueChanges.subscribe(
      (value) => {
        if (typeof value !== 'number' || value < 1) {
          this.histogramFormGroup.controls['bin'].setErrors({invalid: true});
        } else {
          this.histogramFormGroup.controls['bin'].setErrors(null);
          this.onBinInput();
        }
      });
  }

  private onBinInput() {
    this.histogramBin = this.histogramFormGroup.controls['bin'].value;
    this.plotHistogram(this.histogramBin);
    this.binBufferSubject.next(this.histogramBin);
  }

  private linkHistogramSliderInput() {
    this.histogramFormGroup.controls['sliderMin'].valueChanges.subscribe(
      (value) => {
        this.histogramFormGroup.controls['inputMin'].setValue(value, {emitEvent: false});
        this.onHistogramRangeInput();
      });
    this.histogramFormGroup.controls['sliderMax'].valueChanges.subscribe(
      (value) => {
        this.histogramFormGroup.controls['inputMax'].setValue(value, {emitEvent: false});
        this.onHistogramRangeInput();
      });
    this.histogramFormGroup.controls['inputMin'].valueChanges.subscribe(
      (value) => {
        if (typeof value !== 'number' || value < this.fullDataRange.min || value > this.histogramRange.max) {
          this.histogramFormGroup.controls['inputMin'].setErrors({invalid: true});
        } else {
          this.histogramFormGroup.controls['sliderMin'].setValue(value, {emitEvent: false});
          this.onHistogramRangeInput();
          this.histogramFormGroup.controls['inputMin'].setErrors(null);
        }
      });
    this.histogramFormGroup.controls['inputMax'].valueChanges.subscribe(
      (value) => {
        if (typeof value !== 'number' || value > this.fullDataRange.max || value < this.histogramRange.min) {
          this.histogramFormGroup.controls['inputMax'].setErrors({invalid: true});
        } else {
          this.histogramFormGroup.controls['sliderMax'].setValue(value, {emitEvent: false});
          this.onHistogramRangeInput();
          this.histogramFormGroup.controls['inputMax'].setErrors(null);
        }
      });
  }

  private onHistogramRangeInput() {
    this.histogramRange.min = this.histogramFormGroup.controls['inputMin'].value;
    this.histogramRange.max = this.histogramFormGroup.controls['inputMax'].value;
    if (this.histogramRange.min > this.histogramRange.max) {
      this.histogramRange = {min: this.histogramRange.max, max: this.histogramRange.max};
      this.histogramFormGroup.controls['inputMin'].setValue(this.histogramRange.max, {emitEvent: false});
      this.histogramFormGroup.controls['inputMin'].setErrors(null);
      return;
    }
    this.histogramBufferSubject.next(this.histogramRange);
    this.binBufferSubject.next(this.histogramBin);
    this.binBufferSubject.next(this.histogramBin);

    if (this.dataRange.min < this.histogramRange.min) {
      if (this.histogramRange.min < this.dataRange.max) {
        this.dataRange.min = this.histogramRange.min;
      } else {
        this.dataRange = {min: this.histogramRange.min, max: this.histogramRange.min};
        this.dataFormGroup.controls['inputMax'].setValue(this.dataRange.max, {emitEvent: false});
        this.dataFormGroup.controls['inputMax'].setErrors(null);
        this.dataFormGroup.controls['sliderMax'].setValue(this.dataRange.max, {emitEvent: false});
      }
      this.dataFormGroup.controls['inputMin'].setValue(this.dataRange.min, {emitEvent: false});
      this.dataFormGroup.controls['inputMin'].setErrors(null);
      this.dataFormGroup.controls['sliderMin'].setValue(this.dataRange.min, {emitEvent: false});
      this.onRangeInput();
    } else if (this.dataRange.max > this.histogramRange.max) {
      if (this.histogramRange.max > this.dataRange.min) {
        this.dataRange.max = this.histogramRange.max;
      } else {
        this.dataRange = {min: this.histogramRange.max, max: this.histogramRange.max};
        this.dataFormGroup.controls['inputMin'].setValue(this.dataRange.min, {emitEvent: false});
        this.dataFormGroup.controls['inputMin'].setErrors(null);
        this.dataFormGroup.controls['sliderMin'].setValue(this.dataRange.min, {emitEvent: false});
      }
      this.dataFormGroup.controls['inputMax'].setValue(this.dataRange.max, {emitEvent: false});
      this.dataFormGroup.controls['inputMax'].setErrors(null);
      this.dataFormGroup.controls['sliderMax'].setValue(this.dataRange.max, {emitEvent: false});
      this.onRangeInput();
    }
    console.log(
      this.histogramRange,
      this.dataRange);
    this.plotHistogram();
  }


  private linkDataSliderInput() {
    this.dataFormGroup.controls['sliderMin'].valueChanges.pipe(
    ).subscribe(
      (value) => {
        this.dataFormGroup.controls['inputMin'].setValue(value, {emitEvent: false});
        this.dataRange.min = this.dataFormGroup.controls['sliderMin'].value;
        this.onRangeInput();
      });
    this.dataFormGroup.controls['sliderMax'].valueChanges.subscribe(
      (value) => {
        this.dataFormGroup.controls['inputMax'].setValue(value, {emitEvent: false});
        this.dataRange.max = this.dataFormGroup.controls['sliderMax'].value;
        this.onRangeInput();
      });
    this.dataFormGroup.controls['inputMin'].valueChanges.subscribe(
      (value) => {
        if (typeof value !== 'number' || value < this.fullDataRange.min || value > this.dataRange.max) {
          this.dataFormGroup.controls['inputMin'].setErrors({invalid: true});
        } else {
          this.dataFormGroup.controls['sliderMin'].setValue(value, {emitEvent: false});
          this.dataRange.min = this.dataFormGroup.controls['inputMin'].value;
          this.onRangeInput();
          this.dataFormGroup.controls['inputMin'].setErrors(null);
        }
      });
    this.dataFormGroup.controls['inputMax'].valueChanges.subscribe(
      (value) => {
        if (typeof value !== 'number' || value > this.fullDataRange.max || value < this.dataRange.min) {
          this.dataFormGroup.controls['inputMax'].setErrors({invalid: true});
        } else {
          this.dataFormGroup.controls['sliderMax'].setValue(value, {emitEvent: false});
          this.dataRange.max = this.dataFormGroup.controls['inputMax'].value;
          this.onRangeInput();
          this.dataFormGroup.controls['inputMax'].setErrors(null);
        }
      });
  }

  private onRangeInput() {
    this.updateArea();
    this.rangeBufferSubject.next(this.dataRange);
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
}

export interface range {
  min: number,
  max: number,
}
