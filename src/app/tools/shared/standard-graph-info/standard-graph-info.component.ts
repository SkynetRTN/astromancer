import {Component, EventEmitter, Injector, NgModule} from '@angular/core';
import {StandardGraphInfo} from "./standard-graphinfo";
import {ChartAction} from "../types/actions";
import {GraphInfoComponent} from "../directives/graph-info.directive";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

@Component({
  selector: 'app-standard-graphinfo',
  templateUrl: './standard-graph-info.component.html',
  styleUrls: ['./standard-graph-info.component.scss']
})
export class StandardGraphInfoComponent implements GraphInfoComponent {
  info: StandardGraphInfo;
  chartUserActionObs$: EventEmitter<ChartAction[]>;

  constructor(args: Injector) {
    this.info = args.get('defaultChartInfo');
    this.chartUserActionObs$ = new EventEmitter<ChartAction[]>();
  }

  onChange() {
    this.chartUserActionObs$.emit([{action: 'updateLabels', payload: this.info}]);
  }

}

@NgModule({
  imports: [
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    FormsModule,
    BrowserAnimationsModule, // required for clearing out I guess :(
  ],
  declarations: [StandardGraphInfoComponent]
})
export class StandardGraphInfoModule {
}
