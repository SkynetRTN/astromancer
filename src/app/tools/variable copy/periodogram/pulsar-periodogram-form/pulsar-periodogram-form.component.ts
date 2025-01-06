import {Component, OnDestroy} from '@angular/core';
import {PulsarService} from "../../pulsar.service";
import {debounceTime, Subject, takeUntil} from "rxjs";
import {HonorCodePopupService} from "../../../shared/honor-code-popup/honor-code-popup.service";
import {HonorCodeChartService} from "../../../shared/honor-code-popup/honor-code-chart.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-pulsar-periodogram-form',
  templateUrl: './pulsar-periodogram-form.component.html',
  styleUrls: ['./pulsar-periodogram-form.component.scss', '../../pulsar/pulsar.component.scss']
})
export class PulsarPeriodogramFormComponent implements OnDestroy {
  formGroup: any;
  private destroy$: Subject<void> = new Subject<void>();

  constructor(private service: PulsarService,
              private honorCodeService: HonorCodePopupService,
              private chartService: HonorCodeChartService) {
    this.formGroup = new FormGroup({
      chartTitle: new FormControl(this.service.getPeriodogramTitle()),
      dataLabel: new FormControl(this.service.getPeriodogramDataLabel()),
      xAxisLabel: new FormControl(this.service.getPeriodogramXAxisLabel()),
      yAxisLabel: new FormControl(this.service.getPeriodogramYAxisLabel()),
      startPeriod: new FormControl(this.service.getPeriodogramStartPeriod(), [Validators.required]),
      endPeriod: new FormControl(this.service.getPeriodogramEndPeriod(), [Validators.required]),
    });
    this.formGroup.controls['chartTitle'].valueChanges.pipe(
      debounceTime(200),
    ).subscribe((title: string) => {
      this.service.setPeriodogramTitle(title);
    });

    this.formGroup.controls['xAxisLabel'].valueChanges.pipe(
      debounceTime(200),
    ).subscribe((label: string) => {
      this.service.setPeriodogramXAxisLabel(label);
    });

    this.formGroup.controls['yAxisLabel'].valueChanges.pipe(
      debounceTime(200),
    ).subscribe((label: string) => {
      this.service.setPeriodogramYAxisLabel(label);
    });

    this.formGroup.controls['dataLabel'].valueChanges.pipe(
      debounceTime(200),
    ).subscribe((label: string) => {
      this.service.setPeriodogramDataLabel(label);
    });

    this.formGroup.controls['startPeriod'].valueChanges.pipe(
      debounceTime(200),
    ).subscribe((start: number) => {
      this.service.setPeriodogramStartPeriod(start);
    });

    this.formGroup.controls['endPeriod'].valueChanges.pipe(
      debounceTime(200),
    ).subscribe((end: number) => {
      this.service.setPeriodogramEndPeriod(end);
    });
    this.service.periodogramForm$.pipe(
      takeUntil(this.destroy$),
    ).subscribe(info => {
      this.formGroup.controls['chartTitle'].setValue(this.service.getPeriodogramTitle(), {emitEvent: false});
      this.formGroup.controls['xAxisLabel'].setValue(this.service.getPeriodogramXAxisLabel(), {emitEvent: false});
      this.formGroup.controls['yAxisLabel'].setValue(this.service.getPeriodogramYAxisLabel(), {emitEvent: false});
      this.formGroup.controls['dataLabel'].setValue(this.service.getPeriodogramDataLabel(), {emitEvent: false});
      this.formGroup.controls['startPeriod'].setValue(this.service.getPeriodogramStartPeriod(), {emitEvent: false});
      this.formGroup.controls['endPeriod'].setValue(this.service.getPeriodogramEndPeriod(), {emitEvent: false});
    });
  }


  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  saveGraph() {
    this.honorCodeService.honored().subscribe((name: string) => {
      this.chartService.saveImageHighChartOffline(this.service.getHighChartPeriodogram(), "Pulsar Periodogram", name);
    })
  }

  resetForm() {
    this.service.resetPeriodogram();
  }
}
