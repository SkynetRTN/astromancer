import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import * as Highcharts from "highcharts";
import HC_histogram from 'highcharts/modules/histogram-bellcurve';
import {debounceTime, Subject} from "rxjs";
import {FormControl, FormGroup} from "@angular/forms";
import {FsrHistogramPayload} from "../fsr.util";
import {ClusterDataService} from "../../cluster-data.service";
import {MatSlider} from "@angular/material/slider";
import {ClusterService} from "../../cluster.service";

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
  shortTitle!: string;
  @Input()
  unit!: string;
  @Input()
  $initEvent!: Subject<FsrHistogramPayload>;
  @Input()
  chartIndex!: number;
  @Output()
  $OnInit: EventEmitter<void> = new EventEmitter<void>();
  @Output()
  public $range: EventEmitter<range> = new EventEmitter<range>();
  @Output()
  public $histogramRange: EventEmitter<range> = new EventEmitter<range>();
  @Output()
  public $bin: EventEmitter<number> = new EventEmitter<number>();

  @ViewChild('histogramSlider')
  histogramSlider!: MatSlider;
  @ViewChild('rangeSlider')
  rangeSlider!: MatSlider;

  data!: number[];
  fullDataRange: range = {min: 0, max: 0};
  histogramRange: range = {min: 0, max: 0};
  histogramBin: number = 10;
  histogramFormGroup: FormGroup = new FormGroup({});
  dataRange: range = {min: 0, max: 0};
  dataFormGroup: FormGroup = new FormGroup({});
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
      // tickInterval: 0.5,
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

  constructor(private service: ClusterService, private dataService: ClusterDataService) {
    this.initDebounce();
    this.setFormGroups();
  }

  ngOnInit() {
    this.$initEvent.pipe().subscribe(
      (payload: FsrHistogramPayload) => {
        if (this.data === undefined || payload.isNew) {
          this.init(payload);
          this.rangeBufferSubject.next(this.dataRange);
          this.histogramBufferSubject.next(this.histogramRange);
          this.binBufferSubject.next(this.histogramBin);
        }
        this.data = payload.data;
        this.plotHistogram();
      });

    this.dataService.sources$.pipe().subscribe(
      () => {
        this.$OnInit.emit();
      });
    if (this.shortTitle == undefined)
      this.shortTitle = this.title;
  }

  init(payload: FsrHistogramPayload) {
    this.data = payload.data;
    this.setExtremes(payload);
    this.setFormGroups();
    this.linkDataSliderInput();
    this.linkHistogramSliderInput();
    this.linkBinInput();
    this.plotHistogram();
  }

  ngAfterViewInit(): void {
  }

  chartInitialized($event: Highcharts.Chart) {
    this.chartObject = $event;
    this.service.setFsrCharts(this.chartObject, this.chartIndex);
  }

  private setFormGroups() {
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
  }

  private setExtremes(payload: FsrHistogramPayload) {
    let min: number;
    let max: number;
    const data = payload.fullData != null ? payload.fullData : payload.data;
    const sigma = 0.9876; // 2.5 sigma
    const lower = Math.ceil(data.length * (0.5 - sigma / 2));
    const upper = Math.floor(data.length * (0.5 + sigma / 2));
    if (payload.data.length > 0) {
      min = data[lower];
      max = data[upper];
    } else {
      min = -999;
      max = 999;
    }
    this.fullDataRange = {min: min, max: max};
    this.histogramRange = {min: min, max: max};
    this.dataRange = {min: min, max: max};
    this.histogramBin = this.getDefaultBin();
    if (payload.isNew) {
      if (payload?.histogramRange != null) {
        if (payload.histogramRange.min == null)
          this.histogramRange.min = payload.histogramRange.min;
        if (payload.histogramRange.max == null)
          this.histogramRange.max = payload.histogramRange.max;
      }
      if (payload?.range != null) {
        if (payload.range.min == null || payload.range.min >= min)
          this.dataRange.min = payload.range.min;
        if (payload.range.max == null || payload.range.max <= max)
          this.dataRange.max = payload.range.max;
      }
      this.histogramBin = payload?.bin != null ? payload.bin : this.getDefaultBin();
    }
    this.histogramSlider.min = this.fullDataRange.min;
    this.histogramSlider.max = this.fullDataRange.max;
    this.rangeSlider.min = this.histogramRange.min;
    this.rangeSlider.max = this.histogramRange.max;
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
    if (plotData.length === 0) {
      return;
    }
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
    this.updateArea();
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
        if (typeof value !== 'number' || value > this.histogramRange.max) {
          this.histogramFormGroup.controls['inputMin'].setErrors({invalid: true});
        } else {
          this.histogramFormGroup.controls['sliderMin'].setValue(value, {emitEvent: false});
          this.onHistogramRangeInput();
          this.histogramFormGroup.controls['inputMin'].setErrors(null);
        }
      });
    this.histogramFormGroup.controls['inputMax'].valueChanges.subscribe(
      (value) => {
        if (typeof value !== 'number' || value < this.histogramRange.min) {
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
        [this.histogramRange.min, -10],
        [this.dataRange.min, -10],
      ], right: [
        [this.dataRange.max, -10],
        [this.histogramRange.max, -10],
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
