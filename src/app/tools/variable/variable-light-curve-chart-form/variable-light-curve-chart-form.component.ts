import {Component, OnDestroy} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {debounceTime, Subject, takeUntil} from "rxjs";
import {VariableService} from "../../variable/variable.service";

@Component({
  selector: 'app-variable-light-curve-chart-form',
  templateUrl: './variable-light-curve-chart-form.component.html',
  styleUrls: ['./variable-light-curve-chart-form.component.scss']
})
export class VariableLightCurveChartFormComponent implements OnDestroy {
  formGroup!: FormGroup;
  private destroy$: Subject<any> = new Subject<any>();


  constructor(private service: VariableService) {
    this.service.chartInfo$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(info => {
      this.formGroup = new FormGroup({
        chartTitle: new FormControl(this.service.getChartTitle()),
        dataLabel: new FormControl(this.service.getDataLabel()),
        xAxisLabel: new FormControl(this.service.getXAxisLabel()),
        yAxisLabel: new FormControl(this.service.getYAxisLabel()),
      })
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
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

}
