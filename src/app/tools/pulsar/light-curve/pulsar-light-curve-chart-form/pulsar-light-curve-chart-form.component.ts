import {Component, OnDestroy} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {debounceTime, Subject, takeUntil} from "rxjs";
import {PulsarService} from "../../pulsar.service";

@Component({
  selector: 'app-pulsar-light-curve-chart-form',
  templateUrl: './pulsar-light-curve-chart-form.component.html',
  styleUrls: ['./pulsar-light-curve-chart-form.component.scss', '../../../shared/interface/chart-form.scss'],
})
export class PulsarLightCurveChartFormComponent implements OnDestroy {
  formGroup!: FormGroup;
  private destroy$: Subject<any> = new Subject<any>();


  constructor(private service: PulsarService) {
    this.formGroup = new FormGroup({
      chartTitle: new FormControl(this.service.getChartTitle()),
      dataLabel: new FormControl(this.service.getDataLabel()),
      xAxisLabel: new FormControl(this.service.getXAxisLabel()),
      yAxisLabel: new FormControl(this.service.getYAxisLabel()),
    });
    this.formGroup.controls['chartTitle'].valueChanges.pipe(
      debounceTime(200),
    ).subscribe(title => {
      this.service.setChartTitle(title);
    });
    this.formGroup.controls['dataLabel'].valueChanges.pipe(
      debounceTime(200),
    ).subscribe(data => {
      this.service.setDataLabel(data);
    });
    this.formGroup.controls['xAxisLabel'].valueChanges.pipe(
      debounceTime(200),
    ).subscribe(label => {
      this.service.setXAxisLabel(label);
    });
    this.formGroup.controls['yAxisLabel'].valueChanges.pipe(
      debounceTime(200),
    ).subscribe(label => {
      this.service.setYAxisLabel(label);
    });
    this.service.chartInfo$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(info => {
      this.formGroup.controls['chartTitle'].setValue(this.service.getChartTitle(), {emitEvent: false});
      this.formGroup.controls['dataLabel'].setValue(this.service.getDataLabel(), {emitEvent: false});
      this.formGroup.controls['xAxisLabel'].setValue(this.service.getXAxisLabel(), {emitEvent: false});
      this.formGroup.controls['yAxisLabel'].setValue(this.service.getYAxisLabel(), {emitEvent: false});
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  resetLabels() {
    this.service.resetChartInfo();
  }

}
