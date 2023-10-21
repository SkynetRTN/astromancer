import {Component, OnDestroy} from '@angular/core';
import {BehaviorSubject, debounceTime, Subject, takeUntil} from "rxjs";
import {VariableService} from "../../variable.service";
import {HonorCodePopupService} from "../../../shared/honor-code-popup/honor-code-popup.service";
import {HonorCodeChartService} from "../../../shared/honor-code-popup/honor-code-chart.service";
import {FormControl, FormGroup} from "@angular/forms";
import {VariableDisplayPeriod} from "../../variable.service.util";
import {InputSliderValue} from "../../../shared/interface/input-slider/input-slider.component";
import {UpdateSource} from "../../../shared/data/utils";


@Component({
  selector: 'app-variable-period-folding-form',
  templateUrl: './variable-period-folding-form.component.html',
  styleUrls: ['./variable-period-folding-form.component.scss', '../../variable/variable.component.scss']
})
export class VariablePeriodFoldingFormComponent implements OnDestroy {
  formGroup: any;
  displayPeriods = Object.values(VariableDisplayPeriod);
  periodSubject: BehaviorSubject<number>
    = new BehaviorSubject<number>(this.service.getPeriodFoldingPeriod());
  phaseSubject: BehaviorSubject<number>
    = new BehaviorSubject<number>(this.service.getPeriodFoldingPhase());
  private destroy$: Subject<void> = new Subject<void>();

  periodMin: number = this.service.getPeriodogramStartPeriod();
  periodMax: number = this.service.getJdRange();
  periodStep: number = this.getPeriodStep();
  constructor(private service: VariableService,
              private honorCodeService: HonorCodePopupService,
              private chartService: HonorCodeChartService) {
    this.formGroup = new FormGroup({
      chartTitle: new FormControl(this.service.getPeriodFoldingTitle()),
      dataLabel: new FormControl(this.service.getPeriodFoldingDataLabel()),
      xAxisLabel: new FormControl(this.service.getPeriodFoldingXAxisLabel()),
      yAxisLabel: new FormControl(this.service.getPeriodFoldingYAxisLabel()),
      displayPeriod: new FormControl(this.service.getPeriodFoldingDisplayPeriod()),
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
    ).subscribe((period: VariableDisplayPeriod) => {
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
  }


  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  saveGraph() {
    this.honorCodeService.honored().subscribe((name: string) => {
      this.chartService.saveImageHighChartOffline(this.service.getHighChartPeriodFolding(), "Variable Period Folding", name);
    })
  }

  resetForm() {
    this.service.resetPeriodFoldingForm();
  }

  onChange($event: InputSliderValue) {
    if ($event.key === 'period') {
      this.service.setPeriodFoldingPeriod($event.value);
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
