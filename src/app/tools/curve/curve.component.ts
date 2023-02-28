import {Component, EventEmitter, OnInit} from '@angular/core';
import {StandardGraphInfoComponent} from "../common/standard-graph-info/standard-graph-info.component";
import {LineFormComponent} from "./line-form/line-form.component";
import {SimpleTableImplComponent} from "../common/tables/simple-table-impl/simple-table-impl.component";
import {SimpleTableInitArgs} from "../common/tables/simpleTable";

@Component({
  selector: 'app-curve',
  templateUrl: './curve.component.html',
  styleUrls: ['./curve.component.css'],
})
export class CurveComponent implements OnInit {
  graphInfoType: any;
  dataControlType: any;
  tableType: any;
  tableColObserver$: EventEmitter<number>;
  dataSet: any[];

  constructor() {
    this.graphInfoType = StandardGraphInfoComponent;
    this.dataControlType = LineFormComponent;
    this.tableType = SimpleTableImplComponent;
    this.dataSet = [];
    this.tableColObserver$ = new EventEmitter<number>();
  }

  ngOnInit(): void {
  }

  defaultArgs(): SimpleTableInitArgs {
    const data: any[] = [
      {"x": 0, "y1": 25, "y2": '', "y3": '', "y4": ''},
      {"x": 1, "y1": 16, "y2": '', "y3": '', "y4": ''},
      {"x": 2, "y1": 9, "y2": '', "y3": '', "y4": ''},
      {"x": 3, "y1": 4, "y2": '', "y3": '', "y4": ''},
      {"x": 4, "y1": 1, "y2": '', "y3": '', "y4": ''},
      {"x": 5, "y1": 4, "y2": '', "y3": '', "y4": ''},
      {"x": 6, "y1": 9, "y2": '', "y3": '', "y4": ''},
      {"x": 7, "y1": 16, "y2": '', "y3": '', "y4": ''},
      {"x": 8, "y1": 25, "y2": '', "y3": '', "y4": ''},
      {"x": 9, "y1": 36, "y2": '', "y3": '', "y4": ''},
      {"x": '', "y1": '', 'y2': '', "y3": '', "y4": ''},
      {"x": '', "y1": '', 'y2': '', "y3": '', "y4": ''},
      {"x": '', "y1": '', 'y2': '', "y3": '', "y4": ''},
      {"x": '', "y1": '', 'y2': '', "y3": '', "y4": ''},
      {"x": '', "y1": '', 'y2': '', "y3": '', "y4": ''},
    ];
    const hiddenCols: number[] = [2, 3, 4];
    return {data: data, height: 640, hiddenCols: hiddenCols};
  }

  tableObs(event: Event) {
    this.tableColObserver$.emit(event as unknown as number);
  }
}

