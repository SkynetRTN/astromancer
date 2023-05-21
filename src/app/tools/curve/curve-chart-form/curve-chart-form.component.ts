import {Component} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {CurveService} from "../curve.service";
import {debounceTime} from "rxjs";

@Component({
  selector: 'app-curve-chart-form',
  templateUrl: './curve-chart-form.component.html',
  styleUrls: ['./curve-chart-form.component.scss']
})
export class CurveChartFormComponent {
  public formGroup!: FormGroup;

  constructor(private service: CurveService) {
    this.service.chartInfo$.subscribe(info => {
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

}

