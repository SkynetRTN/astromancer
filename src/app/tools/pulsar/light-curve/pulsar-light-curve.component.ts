import {Component, OnDestroy} from '@angular/core';
import {TableAction} from "../../shared/types/actions";
import {PulsarService} from "../pulsar.service";
import {HonorCodePopupService} from "../../shared/honor-code-popup/honor-code-popup.service";
import {HonorCodeChartService} from "../../shared/honor-code-popup/honor-code-chart.service";
import {MyFileParser} from "../../shared/data/FileParser/FileParser";
import {FileType} from "../../shared/data/FileParser/FileParser.util";
import {Subject, takeUntil} from "rxjs";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-pulsar-light-curve',
  templateUrl: './pulsar-light-curve.component.html',
  styleUrls: ['./pulsar-light-curve.component.scss', '../../shared/interface/tools.scss']
})
export class PulsarLightCurveComponent {
  
}
