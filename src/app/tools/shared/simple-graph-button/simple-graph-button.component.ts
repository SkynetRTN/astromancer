import {Component, EventEmitter, NgModule, OnInit, Output} from '@angular/core';
import {ChartAction} from "../types/actions";
import {MatLegacyButtonModule as MatButtonModule} from "@angular/material/legacy-button";

@Component({
  selector: 'app-simple-graph-button',
  templateUrl: './simple-graph-button.component.html',
  styleUrls: ['./simple-graph-button.component.scss']
})
export class SimpleGraphButtonComponent implements OnInit {
  @Output()
  chartUserActionObs$: EventEmitter<ChartAction[]>;

  constructor() {
    this.chartUserActionObs$ = new EventEmitter<ChartAction[]>();
  }

  ngOnInit(): void {
  }


  saveGraph() {
    this.chartUserActionObs$.emit([{action: "saveGraph"}])
  }


  resetGraphInfo() {
    this.chartUserActionObs$.emit([{action: "resetChartInfo"}])
  }
}

@NgModule({
  imports: [MatButtonModule],
  exports: [
    SimpleGraphButtonComponent
  ],
  declarations: [SimpleGraphButtonComponent]
})
export class SimpleGraphButtonModule {
}
