import { Component, OnDestroy, OnInit } from '@angular/core';
import {TableAction} from "../../../shared/types/actions";
import {PulsarService} from "../../pulsar.service";
import {HonorCodePopupService} from "../../../shared/honor-code-popup/honor-code-popup.service";
import {HonorCodeChartService} from "../../../shared/honor-code-popup/honor-code-chart.service";
import {MyFileParser} from "../../../shared/data/FileParser/FileParser";
import {FileType} from "../../../shared/data/FileParser/FileParser.util";
import {Subject, takeUntil} from "rxjs";
import {errorMSE, PulsarDataDict} from "../../pulsar.service.util";
import {MatDialog} from "@angular/material/dialog";
import {
  PulsarLightCurveChartFormComponent
} from "../pulsar-light-curve-chart-form/pulsar-light-curve-chart-form.component";
import { jsDocComment } from '@angular/compiler';
import {BehaviorSubject} from 'rxjs';
import { chart } from 'highcharts';

@Component({
  selector: 'app-pulsar-light-curve-sonifier',
  templateUrl: './pulsar-light-curve-sonifier.component.html',
  styleUrls: ['./pulsar-light-curve-sonifier.component.scss']
})
export class PulsarLightCurveSonifierComponent {
    chartData: {jd: number, source1: number, source2: number}[] = [];

    constructor(private service: PulsarService,
                private honorCodeService: HonorCodePopupService,
                private chartService: HonorCodeChartService,
                public dialog: MatDialog) {}

  sonification() {
    this.chartData = this.service.getData().filter(
      (d): d is { jd: number; source1: number; source2: number } => d.jd !== null
    );    

    // Extract individual time series
    const source1 = this.chartData.map(d => [d.jd, d.source1]);
    const source2 = this.chartData.map(d => [d.jd, d.source2]);

    // Bin the data
    let binnedData = this.service.binData(source1, this.service.getPeriodFoldingBins());
    const xValues = binnedData.map(point => point[0]);
    const yValues = binnedData.map(point => point[1]);

    let binnedData2 = this.service.binData(source2, this.service.getPeriodFoldingBins());
    const yValues2 = binnedData2.map(point => point[1]);

    const duration = xValues[xValues.length - 1] - xValues[0];
    
    this.service.sonification(xValues, yValues, yValues2, duration); 
  }

  get isPlaying(): boolean {
    return this.service.isPlaying;
  }  

  sonificationBrowser() {
    this.chartData = this.service.getData().filter(
      (d): d is { jd: number; source1: number; source2: number } => d.jd !== null
    );    
    
    const source1 = this.chartData.map(d => [d.jd, d.source1]);
    const source2 = this.chartData.map(d => [d.jd, d.source2]);

    let binnedData = this.service.binData(source1, this.service.getPeriodFoldingBins());
    const xValues = binnedData.map(point => point[0]);
    const yValues = binnedData.map(point => point[1]);

    let binnedData2 = this.service.binData(source2, this.service.getPeriodFoldingBins());
    const yValues2 = binnedData2.map(point => point[1]);

    const duration = xValues[xValues.length - 1] - xValues[0];

    this.service.sonificationBrowser(xValues, yValues, yValues2, duration); 
  }
}
