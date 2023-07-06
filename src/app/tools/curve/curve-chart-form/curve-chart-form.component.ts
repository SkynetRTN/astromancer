import {Component, OnDestroy} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {CurveService} from "../curve.service";
import {debounceTime, Subject, takeUntil} from "rxjs";
import {HonorCodePopupService} from "../../shared/honor-code-popup/honor-code-popup.service";
import {HonorCodeChartService} from "../../shared/honor-code-popup/honor-code-chart.service";

@Component({
  selector: 'app-curve-chart-form',
  templateUrl: './curve-chart-form.component.html',
  styleUrls: ['./curve-chart-form.component.scss']
})
export class CurveChartFormComponent implements OnDestroy {
  public formGroup!: FormGroup;
  private destroy$: Subject<any> = new Subject<any>();

  constructor(private service: CurveService,
              private honorCodeService: HonorCodePopupService,
              private chartService: HonorCodeChartService,) {
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

  resetLabels() {
    this.service.resetChartInfo();
  }
}

