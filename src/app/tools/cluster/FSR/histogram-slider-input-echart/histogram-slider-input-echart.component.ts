import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {ECharts, EChartsOption, MarkAreaComponentOption} from 'echarts';
import {ThemeOption} from 'ngx-echarts';
import {debounceTime, Subject, takeUntil} from 'rxjs';
import {FormControl, FormGroup} from '@angular/forms';
import {MatSlider} from '@angular/material/slider';
import {FsrHistogramPayload} from '../fsr.util';
import {ClusterDataService} from '../../cluster-data.service';
import {ClusterService} from '../../cluster.service';
import {AppearanceService} from '../../../../shared/settings/appearance/service/appearance.service';
import {getHighchartsEchartsTheme} from '../../../../shared/settings/appearance/service/echarts-theme';
import {computeHistogram} from '../../echarts-utils';

@Component({
  selector: 'app-histogram-slider-input-echart',
  templateUrl: './histogram-slider-input-echart.component.html',
  styleUrls: ['./histogram-slider-input-echart.component.scss', '../../../shared/interface/tools.scss']
})
export class HistogramSliderInputEchartComponent implements OnInit, AfterViewInit, OnDestroy {
  chartOptions: EChartsOption = {};
  chartTheme: ThemeOption | string;
  private chartInstance?: ECharts;
  private destroy$ = new Subject<void>();

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

  private rangeBufferSubject: Subject<range> = new Subject<range>();
  private $rangeBuffer = this.rangeBufferSubject.asObservable();
  private histogramBufferSubject: Subject<range> = new Subject<range>();
  private $histogramBuffer = this.histogramBufferSubject.asObservable();
  private binBufferSubject: Subject<number> = new Subject<number>();
  private $binBuffer = this.binBufferSubject.asObservable();

  constructor(private service: ClusterService,
              private dataService: ClusterDataService,
              private appearanceService: AppearanceService) {
    this.chartTheme = getHighchartsEchartsTheme(this.appearanceService.getColorTheme());
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

  ngAfterViewInit(): void {
    this.appearanceService.colorTheme$
      .pipe(takeUntil(this.destroy$))
      .subscribe(theme => {
        this.chartTheme = getHighchartsEchartsTheme(theme);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onChartInit(chart: ECharts): void {
    this.chartInstance = chart;
    this.service.setFsrECharts(chart, this.chartIndex);
    this.plotHistogram();
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
    const sigma = 0.9876;
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
    return Math.ceil(Math.sqrt(plotData.length));
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
      this.updateChart([], bin ?? this.histogramBin);
      return;
    }
    const plotData = this.getPlotData();
    if (plotData.length === 0) {
      this.updateChart([], bin ?? this.histogramBin);
      return;
    }
    if (bin == null)
      bin = this.getDefaultBin(plotData);
    this.histogramBin = bin;
    this.histogramFormGroup.controls['bin'].setValue(bin, {emitEvent: false});
    this.updateChart(plotData, bin);
  }

  private updateChart(plotData: number[], bin: number): void {
    const histogram = computeHistogram(plotData, bin, this.histogramRange);
    this.chartOptions = {
      animation: false,
      grid: {
        left: 40,
        right: 10,
        top: 20,
        bottom: 30,
      },
      tooltip: {
        trigger: 'axis',
      },
      xAxis: {
        type: 'value',
        min: this.histogramRange.min,
        max: this.histogramRange.max,
      },
      yAxis: {
        type: 'value',
        min: 0,
      },
      series: [
        {
          name: '#Stars in Bin',
          type: 'bar',
          data: histogram.bins,
          barMaxWidth: 18,
          markArea: this.getMarkArea(),
        }
      ],
    };
    this.chartInstance?.setOption(this.chartOptions, true);
  }

  private getMarkArea(): MarkAreaComponentOption {
    const data: MarkAreaComponentOption['data'] = [
      [
        {xAxis: this.histogramRange.min},
        {xAxis: this.dataRange.min},
      ],
      [
        {xAxis: this.dataRange.max},
        {xAxis: this.histogramRange.max},
      ]
    ];
    return {
      silent: true,
      itemStyle: {
        opacity: 0.3,
      },
      data,
    };
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
    this.plotHistogram();
    this.rangeBufferSubject.next(this.dataRange);
  }
}

export interface range {
  min: number,
  max: number,
}
