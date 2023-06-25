import {Component, OnDestroy} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {MoonService} from "../moon.service";
import {debounceTime, Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-moon-chart-form',
  templateUrl: './moon-chart-form.component.html',
  styleUrls: ['./moon-chart-form.component.scss']
})
export class MoonChartFormComponent implements OnDestroy {
  private destroy$: Subject<any> = new Subject<any>();
  formGroup!: FormGroup;

  constructor(private service: MoonService) {
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
      ).subscribe(labels => {
        this.service.setDataLabel(labels);
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