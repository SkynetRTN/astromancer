import {Component, OnDestroy} from '@angular/core';
import {BehaviorSubject, debounceTime, Subject, takeUntil} from "rxjs";
import {PulsarService} from "../../pulsar.service";
import {HonorCodePopupService} from "../../../shared/honor-code-popup/honor-code-popup.service";
import {HonorCodeChartService} from "../../../shared/honor-code-popup/honor-code-chart.service";
import {FormControl, FormGroup} from "@angular/forms";
import {PulsarDisplayPeriod} from "../../pulsar.service.util";
import {InputSliderValue} from "../../../shared/interface/input-slider/input-slider.component";
import {UpdateSource} from "../../../shared/data/utils";


@Component({
  selector: 'app-pulsar-period-folding-form',
  templateUrl: './pulsar-period-folding-form.component.html',
  styleUrls: ['./pulsar-period-folding-form.component.scss', '../../pulsar/pulsar.component.scss']
})
export class PulsarPeriodFoldingFormComponent implements OnDestroy {
  formGroup: any;
  displayPeriods = Object.values(PulsarDisplayPeriod);
  periodSubject: BehaviorSubject<number>
    = new BehaviorSubject<number>(this.service.getPeriodFoldingPeriod());
  phaseSubject: BehaviorSubject<number>
    = new BehaviorSubject<number>(this.service.getPeriodFoldingPhase());
  calSubject: BehaviorSubject<number>
    = new BehaviorSubject<number>(this.service.getPeriodFoldingCal());
  speedSubject: BehaviorSubject<number>
    = new BehaviorSubject<number>(this.service.getPeriodFoldingSpeed());

  calFile: boolean = true;
  periodMin: number = this.service.getJdRange();
  periodMax: number = 200;
  periodStep: number = 0.1;
  showSlider = true;
  private destroy$: Subject<void> = new Subject<void>();

  ngOnInit(): void {
    this.service.lightCurveOptionValid$.subscribe(value => {
      this.calFile = value;
    
      setTimeout(() => {
        this.periodSubject.next(this.service.getPeriodFoldingPeriod());
      });
    });    

    const data = this.service.getPeriodFoldingChartData();
    const sum = data['data2'].reduce((sum, item) => sum + item[1], 0) === 0;
    if (sum == true) {
      this.periodMax = this.service.getPeriodFoldingPeriod();
      this.calFile = false;
    }
  }   

  constructor(private service: PulsarService,
              private honorCodeService: HonorCodePopupService,
              private chartService: HonorCodeChartService) {
    this.formGroup = new FormGroup({
      chartTitle: new FormControl(this.service.getPeriodFoldingTitle()),
      dataLabel: new FormControl(this.service.getPeriodFoldingDataLabel()),
      xAxisLabel: new FormControl(this.service.getPeriodFoldingXAxisLabel()),
      yAxisLabel: new FormControl(this.service.getPeriodFoldingYAxisLabel()),
      displayPeriod: new FormControl(this.service.getPeriodFoldingDisplayPeriod()),
      period: new FormControl(this.periodMin),
      phase: new FormControl(0),
      cal: new FormControl(1),
      speed: new FormControl(1)
    });
    this.formGroup.controls['chartTitle'].valueChanges.pipe(
      debounceTime(200),
    ).subscribe((title: string) => {
      this.service.setPeriodFoldingTitle(title);
    });
    this.formGroup.controls['dataLabel'].valueChanges.pipe(
      debounceTime(200),
    ).subscribe((label: string) => {
      this.service.setPeriodFoldingDataLabel(label);
    });
    this.formGroup.controls['xAxisLabel'].valueChanges.pipe(
      debounceTime(200),
    ).subscribe((label: string) => {
      this.service.setPeriodFoldingXAxisLabel(label);
    });
    this.formGroup.controls['yAxisLabel'].valueChanges.pipe(
      debounceTime(200),
    ).subscribe((label: string) => {
      this.service.setPeriodFoldingYAxisLabel(label);
    });
    this.formGroup.controls['cal'].valueChanges.pipe(
      debounceTime(200),
    ).subscribe((label: number) => {  
      this.service.setPeriodFoldingCal(label);
    });
    this.formGroup.controls['speed'].valueChanges.pipe(
      debounceTime(200),
    ).subscribe((label: number) => {
      this.service.setPeriodFoldingSpeed(label);
    });
    this.formGroup.controls['displayPeriod'].valueChanges.pipe(
      debounceTime(200),
    ).subscribe((period: PulsarDisplayPeriod) => {
      this.service.setPeriodFoldingDisplayPeriod(period);
      this.periodStep = this.getPeriodStep();
    });
    this.service.periodFoldingForm$.pipe(
      takeUntil(this.destroy$),
    ).subscribe((source: UpdateSource) => {
      this.formGroup.controls['chartTitle'].setValue(this.service.getPeriodFoldingTitle(), {emitEvent: false});
      this.formGroup.controls['dataLabel'].setValue(this.service.getPeriodFoldingDataLabel(), {emitEvent: false});
      this.formGroup.controls['xAxisLabel'].setValue(this.service.getPeriodFoldingXAxisLabel(), {emitEvent: false});
      this.formGroup.controls['yAxisLabel'].setValue(this.service.getPeriodFoldingYAxisLabel(), {emitEvent: false});
      this.formGroup.controls['cal'].setValue(this.service.getPeriodFoldingCal(), {emitEvent: false});
      this.formGroup.controls['speed'].setValue(this.service.getPeriodFoldingSpeed(), {emitEvent: false});
      this.formGroup.controls['displayPeriod'].setValue(this.service.getPeriodFoldingDisplayPeriod(), {emitEvent: false});
      if (source !== UpdateSource.INTERFACE) {
        this.periodSubject.next(this.service.getPeriodFoldingPeriod());
        this.phaseSubject.next(this.service.getPeriodFoldingPhase());
        this.calSubject.next(this.service.getPeriodFoldingCal());
      }
    });
    this.service.periodogramForm$.pipe(
      takeUntil(this.destroy$),
    ).subscribe(() => {
      this.periodStep = this.getPeriodStep();
    });
    this.service.data$.pipe(
      takeUntil(this.destroy$),
    ).subscribe(() => {
      this.periodMin = this.service.getPeriodogramStartPeriod();
      if (this.calFile == true) {
        this.periodMax = this.service.getJdRange();
      } else {
        this.periodMax = this.service.getPeriodFoldingPeriod();
      }
      this.periodStep = this.getPeriodStep();
    });
  }
  
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  saveGraph() {
    this.honorCodeService.honored().subscribe((name: string) => {
      this.chartService.saveImageHighChartOffline(this.service.getHighChartPeriodFolding(), "Pulsar Period Folding", name);
    })
  }

  resetSliderWithValue(newValue: number) {
    this.showSlider = false; // destroy the component
    setTimeout(() => {
      this.periodSubject = new BehaviorSubject<number>(newValue); // or .next(...) if subject stays the same
      this.showSlider = true; // recreate the component
    });
  }  

  resetForm() {
    this.service.resetPeriodFoldingForm();
  }

  resetPulsar() {
    this.service.resetData();   
    window.location.reload();
  }

  sonification() {
    this.periodSubject.subscribe(value => {
      let period = value;

      if (this.calFile) {
        const data = this.service.getPeriodFoldingChartData();
        let binnedData = this.service.binData(data['data'], 100);
        const xValues = binnedData.map(point => point[0]);
        const yValues = binnedData.map(point => point[1]);

        let binnedData2 = this.service.binData(data['data2'], 100);
        const yValues2 = binnedData2.map(point => point[1]);
        
        this.service.sonification(xValues, yValues, yValues2, this.service.getPeriodFoldingPeriod()); 
      } else {
        const rawData = this.service.getData()
        .filter(item => item.jd !== null && item.source1 !== null);
      
        const xValues = rawData.map(item => Number(item.jd));
        const yValues = rawData.map(item => Number(item.source1));
        
        this.service.sonification(xValues, yValues, null, this.service.getPeriodFoldingPeriod());
      }
    });
  }

  get isPlaying(): boolean {
    return this.service.isPlaying;
  }  

  sonificationBrowser() {
    this.periodSubject.subscribe(value => {
      let period = value;

      if (this.calFile) {
        const data = this.service.getPeriodFoldingChartData();
        let binnedData = this.service.binData(data['data'], 100);
        const xValues = binnedData.map(point => point[0]);
        const yValues = binnedData.map(point => point[1]);

        let binnedData2 = this.service.binData(data['data2'], 100);
        const yValues2 = binnedData2.map(point => point[1]);
        
        this.service.sonificationBrowser(xValues, yValues, yValues2, this.service.getPeriodFoldingPeriod()); 
      } else {
        const rawData = this.service.getData()
        .filter(item => item.jd !== null && item.source1 !== null);
      
        const xValues = rawData.map(item => Number(item.jd));
        const yValues = rawData.map(item => Number(item.source1));
        
        this.service.sonificationBrowser(xValues, yValues, null, this.service.getPeriodFoldingPeriod());
      }
    });
  }

  onChange($event: InputSliderValue) {
    if ($event.key === 'period') {
      if (this.calFile) {
        this.service.setPeriodFoldingPeriod($event.value);
      };
      this.periodStep = this.getPeriodStep();
    } else if ($event.key === 'phase') {
      this.service.setPeriodFoldingPhase($event.value);
    } else if ($event.key === 'calibration') {
      this.service.setPeriodFoldingCal($event.value);
    } else if ($event.key === 'speed') {
      this.service.setPeriodFoldingSpeed($event.value);
    }
  }

  getPeriodStep() {
    const someVal = Math.pow(this.service.getPeriodFoldingPeriod(), 2) * 0.01 / this.service.getJdRange();
    if (someVal > 10e-6) {
      return parseFloat(someVal.toFixed(4));
    } else {
      return 10e-6;
    }
  }
}
