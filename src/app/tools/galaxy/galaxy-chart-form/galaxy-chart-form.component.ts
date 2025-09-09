import {Component, OnDestroy} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {debounceTime, Subject, takeUntil} from "rxjs";
import {GalaxyService} from "../galaxy.service";

@Component({
  selector: 'app-galaxy-chart-form',
  templateUrl: './galaxy-chart-form.component.html',
  styleUrls: ['./galaxy-chart-form.component.scss', '../../shared/interface/chart-form.scss']
})
export class GalaxyChartFormComponent implements OnDestroy {
  formGroup!: FormGroup;
  private destroy$: Subject<any> = new Subject<any>();

  constructor(private service: GalaxyService) {
    this.service.chartInfo$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(info => {
      this.formGroup = new FormGroup({
        chartTitle: new FormControl(this.service.getChartTitle()),
        dataLabel: new FormControl({value: this.service.getDataLabel(), disabled: true}),
        xAxisLabel: new FormControl(this.service.getXAxisLabel()),
        yAxisLabel: new FormControl(this.service.getYAxisLabel()),
      })
      this.formGroup.controls['chartTitle'].valueChanges.pipe(
        debounceTime(200),
      ).subscribe(title => {
        this.service.setChartTitle(title);
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

  resetLabels() {
    this.service.resetChartInfo();
  }
}
