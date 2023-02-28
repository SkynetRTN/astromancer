import {AfterViewInit, Component, EventEmitter, OnInit, Output} from '@angular/core';

interface CurveCounts {
  value: number;
  viewValue: string
}

@Component({
  selector: 'app-line-form',
  templateUrl: './line-form.component.html',
  styleUrls: ['./line-form.component.css'],
})
export class LineFormComponent implements OnInit, AfterViewInit {
  curveCounts: CurveCounts[] = [
    {value: 1, viewValue: '1'},
    {value: 2, viewValue: '2'},
    {value: 3, viewValue: '3'},
    {value: 4, viewValue: '4'},
  ]
  selectedValue: number = this.curveCounts[0].value;
  @Output() public tableObs$ = new EventEmitter<number>();

  constructor() {
  }

  ngOnInit() {

  }

  ngAfterViewInit(): void {
  }

  onCurveNumChange(value: number) {
    this.tableObs$.emit(value);
  };

}
