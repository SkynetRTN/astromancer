import {Component, EventEmitter, NgModule, OnInit} from '@angular/core';
import {GraphButtonComponent} from "../directives/graph-button.directive";
import {ChartAction} from "../types/actions";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'app-simple-graph-button',
  templateUrl: './simple-graph-button.component.html',
  styleUrls: ['./simple-graph-button.component.scss']
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

@NgModule({
  imports: [MatButtonModule],
  declarations: [SimpleGraphButtonComponent]
})
export class SimpleGraphButtonModule {
}
