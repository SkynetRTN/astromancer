import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatFormFieldControl} from "@angular/material/form-field";

interface CurveCounts {
  value: number;
  viewValue: string
}

@Component({
  selector: 'app-line-form',
  templateUrl: './line-form.component.html',
  styleUrls: ['./line-form.component.css']
})
export class LineFormComponent implements AfterViewInit {
  curveCounts: CurveCounts[] = [
    {value: 1, viewValue: '1'},
    {value: 2, viewValue: '2'},
    {value: 3, viewValue: '3'},
    {value: 4, viewValue: '4'},
  ]
  selectedValue: number = this.curveCounts[0].value;
  @ViewChild('curveCountForm') curveCountForm!: MatFormFieldControl<CurveCounts>;

  constructor() {
  }

  ngAfterViewInit(): void {
  }

}
