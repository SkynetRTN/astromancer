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
      startPeriodLabel: new FormControl(this.service.getPeriodogramStartPeriodLabel()),
      endPeriodLabel: new FormControl(this.service.getPeriodogramEndPeriodLabel()),
      startPeriod: new FormControl(this.service.getPeriodogramStartPeriod(), [Validators.required]),
      endPeriod: new FormControl(this.service.getPeriodogramEndPeriod(), [Validators.required]),
      numPoints: new FormControl(this.service.getPeriodogramPoints(), [Validators.required]),
      methodLS: new FormControl(this.service.getPeriodogramMethod()),
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

    // this.formGroup.controls['dataLabel'].valueChanges.pipe(
    //   debounceTime(200),
    // ).subscribe((label: string) => {
    //   this.service.setPeriodogramDataLabel(label);
    // });

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

    // this.formGroup.controls['numPoints'].valueChanges.pipe(
    //   debounceTime(200),
    // ).subscribe((points: number) => {
    //   this.service.setPeriodogramPoints(points);
    // });

    // this.formGroup.controls['methodLS'].valueChanges.pipe(
    //   debounceTime(200),
    // ).subscribe((method: boolean) => {
    //   this.service.setPeriodogramMethod(method);
    // });

    // const methodLSValue = this.formGroup.get('methodLS')?.value;
    // this.service.getLabels(methodLSValue);
  
    this.formGroup.controls['methodLS'].valueChanges.pipe(
      debounceTime(200),
    ).subscribe((value: boolean) => {

      const labels = this.service.getLabels(value);
      
      this.service.setPeriodogramStartPeriodLabel(labels.startPeriodLabel);
      this.service.setPeriodogramEndPeriodLabel(labels.endPeriodLabel);
    
      this.service.setPeriodogramMethod(value);
    });

    this.service.periodogramForm$.pipe(
      takeUntil(this.destroy$),
    ).subscribe(info => {
      this.formGroup.controls['dataLabel'].setValue(this.service.getPeriodogramDataLabel(), {emitEvent: false});
      this.formGroup.controls['startPeriodLabel'].setValue(this.service.getPeriodogramStartPeriodLabel(), {emitEvent: false});
      this.formGroup.controls['endPeriodLabel'].setValue(this.service.getPeriodogramEndPeriodLabel(), {emitEvent: false});
      this.formGroup.controls['startPeriod'].setValue(this.service.getPeriodogramStartPeriod(), {emitEvent: false});
      this.formGroup.controls['endPeriod'].setValue(this.service.getPeriodogramEndPeriod(), {emitEvent: false});
      this.formGroup.controls['numPoints'].setValue(this.service.getPeriodogramPoints(), {emitEvent: false});
      this.formGroup.controls['methodLS'].setValue(this.service.getPeriodogramMethod(), {emitEvent: false});

      this.formGroup.controls['chartTitle'].setValue(
        this.service.getPeriodogramTitle(),
        { emitEvent: false } 
      );
    });
  }


  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  compute() {
    const values = this.formGroup.value;
  
    this.service.setPeriodogramDataLabel(values.dataLabel);
    
    this.service.setPeriodogramStartPeriod(values.startPeriod);
    this.service.setPeriodogramEndPeriod(values.endPeriod);
  
    this.service.setPeriodogramPoints(values.numPoints);

    if (this.service.getPeriodogramStartPeriod() < this.service.getPeriodogramEndPeriod()) {
      this.service.compute(true);
    }
  }

  get startPeriodLabel(): string {
    return this.formGroup?.get('startPeriodLabel')?.value || 'Start Period (s)';
  }
  
  get endPeriodLabel(): string {
    return this.formGroup?.get('endPeriodLabel')?.value || 'End Period (s)';
  }  
  
  saveGraph() {
    this.honorCodeService.honored().subscribe((name: string) => {
      this.chartService.saveImageHighChartOffline(this.service.getHighChartPeriodogram(), "Pulsar Periodogram", name);
    })
  }

  resetForm() {
    this.formGroup.patchValue({
      chartTitle: 'Title',
      xAxisLabel: 'Period (s)',
      yAxisLabel: 'Intensity',
    });
    this.service.resetPeriodogram();

    this.service.setPeriodogramStartPeriodLabel("Start Period (s)");
    this.service.setPeriodogramEndPeriodLabel("End Period (s)");
  }
}
