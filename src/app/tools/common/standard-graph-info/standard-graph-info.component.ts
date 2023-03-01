import {Component, EventEmitter} from '@angular/core';
import {StandardGraphInfo} from "./standard-graphinfo";
import {ChartAction} from "../types/actions";
import {GraphInfoComponent} from "../directives/graph-info.directive";

@Component({
  selector: 'app-standard-graphinfo',
  templateUrl: './standard-graph-info.component.html',
  styleUrls: ['./standard-graph-info.component.css']
})
export class StandardGraphInfoComponent implements GraphInfoComponent{
  info: StandardGraphInfo;
  chartUserActionObs$: EventEmitter<ChartAction[]>;

  constructor() {
    this.info = new StandardGraphInfo("Title", "Data", "x", "y");
    this.chartUserActionObs$ = new EventEmitter<ChartAction[]>();
  }

  onChange() {
    this.chartUserActionObs$.emit([{action: 'updateLabels', payload: this.info}]);
  }

}
