import {Component, EventEmitter, Output} from '@angular/core';
import {ChartAction, TableAction} from "../../shared/types/actions";
import {DataControlComponent} from "../../shared/directives/data-control.directive";

interface CurveCounts {
  value: number;
  viewValue: string
}

@Component({
  selector: 'app-line-form',
  templateUrl: './line-form.component.html',
  styleUrls: ['./line-form.component.css'],
})
export class LineFormComponent implements DataControlComponent {

  @Output() public tableUserActionObs$ = new EventEmitter<TableAction[]>();
  @Output() public chartUserActionObs$ = new EventEmitter<ChartAction[]>();
  curveCounts: CurveCounts[] = [
    {value: 1, viewValue: '1'},
    {value: 2, viewValue: '2'},
    {value: 3, viewValue: '3'},
    {value: 4, viewValue: '4'},
  ]
  selectedValue: number = this.curveCounts[0].value;


  constructor() {
  }

  onCurveNumChange(value: number) {
    const tableAction: TableAction = {action: 'curveNumChange', payload: value};
    this.tableUserActionObs$.emit([tableAction]);
  };

  onMagnitude(value: any) {
    const tableAction: TableAction = {action: 'flipY', payload: value};
    this.chartUserActionObs$.emit([tableAction]);
  }

}
