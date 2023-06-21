import {AfterViewInit, Component, EventEmitter, NgModule, Output, ViewChild} from '@angular/core';
import {ChartAction} from "../types/actions";
import {MatLegacyButtonModule as MatButtonModule} from "@angular/material/legacy-button";
import {MatProgressSpinner, MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatButton} from "@angular/material/button";
import {HonorCodePopupService} from "../honor-code-popup/honor-code-popup.service";

@Component({
  selector: 'app-simple-graph-button',
  templateUrl: './simple-graph-button.component.html',
  styleUrls: ['./simple-graph-button.component.scss']
})
export class SimpleGraphButtonComponent implements AfterViewInit {
  @ViewChild("saveGraphButton") saveGraphButton!: MatButton;
  @ViewChild("saveGraphSpinner") saveGraphSpinner!: MatProgressSpinner;
  @Output()
  private chartUserActionObs$: EventEmitter<ChartAction[]>;

  constructor(private popupService: HonorCodePopupService) {
    this.chartUserActionObs$ = new EventEmitter<ChartAction[]>();

  }

  ngAfterViewInit(): void {
    this.popupService.registerSaveGraphButton(this.saveGraphButton);
    this.popupService.registerSaveGraphSpinner(this.saveGraphSpinner);
  }


  saveGraph() {
    this.chartUserActionObs$.emit([{action: "saveGraph"}]);
  }

  resetGraphInfo() {
    this.chartUserActionObs$.emit([{action: "resetChartInfo"}])
  }

}

@NgModule({
  imports: [MatButtonModule, MatProgressSpinnerModule],
  exports: [
    SimpleGraphButtonComponent
  ],
  declarations: [SimpleGraphButtonComponent]
})
export class SimpleGraphButtonModule {
}
