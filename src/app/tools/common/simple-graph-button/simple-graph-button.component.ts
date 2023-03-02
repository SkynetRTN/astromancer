import {Component, EventEmitter, OnInit} from '@angular/core';
import {GraphButtonComponent} from "../directives/graph-button.directive";
import {ChartAction} from "../types/actions";

@Component({
  selector: 'app-simple-graph-button',
  templateUrl: './simple-graph-button.component.html',
  styleUrls: ['./simple-graph-button.component.css']
})
export class SimpleGraphButtonComponent implements OnInit, GraphButtonComponent {

  chartUserActionObs$: EventEmitter<ChartAction[]>;

  constructor() {
    this.chartUserActionObs$ = new EventEmitter<ChartAction[]>();
  }

  ngOnInit(): void {
  }


  saveGraph() {
    this.chartUserActionObs$.emit([{action: "saveGraph"}])
  }


}
