import {AfterViewInit, Component, OnDestroy} from '@angular/core';
import {debounceTime, Subject, takeUntil} from "rxjs";
import * as Highcharts from "highcharts";
import {VariableService} from "../../variable.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {HonorCodePopupService} from "../../../shared/honor-code-popup/honor-code-popup.service";
import {HonorCodeChartService} from "../../../shared/honor-code-popup/honor-code-chart.service";

@Component({
  selector: 'app-variable-periodogram',
  templateUrl: './variable-periodogram.component.html',
  styleUrls: ['./variable-periodogram.component.scss']
})
export class VariablePeriodogramComponent {
}
