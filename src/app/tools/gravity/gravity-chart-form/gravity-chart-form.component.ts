import {Component, OnDestroy} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {debounceTime, Subject, takeUntil} from "rxjs";
import {StrainService} from "../gravity-strain.service";

@Component({
  selector: 'app-gravity-chart-form',
  templateUrl: './gravity-chart-form.component.html',
  styleUrls: ['./gravity-chart-form.component.scss', '../../shared/interface/chart-form.scss']
})
export class GravityChartFormComponent implements OnDestroy {
  formGroup!: FormGroup;
  private destroy$: Subject<any> = new Subject<any>();

  constructor(private strainService: StrainService) {
    this.strainService.chartInfo$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(info => {
      this.formGroup = new FormGroup({
        chartTitle: new FormControl(this.strainService.getChartTitle()),
        dataLabel: new FormControl({value: this.strainService.getDataLabel(), disabled: true}),
        xAxisLabel: new FormControl(this.strainService.getXAxisLabel()),
        yAxisLabel: new FormControl(this.strainService.getYAxisLabel()),
      })
      this.formGroup.controls['chartTitle'].valueChanges.pipe(
        debounceTime(200),
      ).subscribe(title => {
        this.strainService.setChartTitle(title);
      });
      this.formGroup.controls['xAxisLabel'].valueChanges.pipe(
        debounceTime(200),
      ).subscribe(label => {
        this.strainService.setXAxisLabel(label);
      });
      this.formGroup.controls['yAxisLabel'].valueChanges.pipe(
        debounceTime(200),
      ).subscribe(label => {
        this.strainService.setYAxisLabel(label);
      });
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  resetLabels() {
    this.strainService.resetChartInfo();
  }
}
