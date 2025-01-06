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
  periodMin: number = this.service.getPeriodogramStartPeriod();
  periodMax: number = this.service.getJdRange();
  periodStep: number = this.getPeriodStep();
  private destroy$: Subject<void> = new Subject<void>();

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
      this.formGroup.controls['displayPeriod'].setValue(this.service.getPeriodFoldingDisplayPeriod(), {emitEvent: false});
      if (source !== UpdateSource.INTERFACE) {
        this.periodSubject.next(this.service.getPeriodFoldingPeriod());
        this.phaseSubject.next(this.service.getPeriodFoldingPhase());
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
      this.periodMax = this.service.getJdRange();
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

  resetForm() {
    this.service.resetPeriodFoldingForm();
  }

  onChange($event: InputSliderValue) {
    if ($event.key === 'period') {
      this.service.setPeriodFoldingPeriod($event.value);
      this.periodStep = this.getPeriodStep();
    } else if ($event.key === 'phase') {
      this.service.setPeriodFoldingPhase($event.value);
    }
  }

  getPeriodStep() {
    const someVal = Math.pow(this.service.getPeriodFoldingPeriod(), 2) * 0.01 / this.service.getJdRange();
    if (someVal > 10e-6) {
      // step = round((periodFoldingForm.period_num.value/range)*0.01, 4)
      return parseFloat(someVal.toFixed(4));
    } else {
      return 10e-6;
    }
  }

}
