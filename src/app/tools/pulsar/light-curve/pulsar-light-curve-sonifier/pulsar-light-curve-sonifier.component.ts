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

    const filtered = this.chartData.filter(d =>
      !isNaN(d.jd) && !isNaN(d.source1) && !isNaN(d.source2)
    );

    let xValues = filtered.map(d => d.jd);
    let yValues = filtered.map(d => d.source1);
    let yValues2 = filtered.map(d => d.source2);

    const start = xValues[0];
    let duration = xValues[xValues.length - 1] - start;

    if (duration > 60) {
      // Find first index where x - start > 60
      const cutIndex = xValues.findIndex(x => x - start > 60);

      // Slice all arrays up to that index
      const end = cutIndex !== -1 ? cutIndex : xValues.length;
      xValues = xValues.slice(0, end);
      yValues = yValues.slice(0, end);
      yValues2 = yValues2.slice(0, end);

      duration = xValues[xValues.length - 1] - start;
    }
    
    this.service.sonification(xValues, yValues, yValues2, duration, this.service.getChartTitle()); 
  }

  get isPlaying(): boolean {
    return this.service.isPlaying;
  }  

  sonificationBrowser() {
    this.chartData = this.service.getData().filter(
      (d): d is { jd: number; source1: number; source2: number } => d.jd !== null
    );    

    const filtered = this.chartData.filter(d =>
      !isNaN(d.jd) && !isNaN(d.source1) && !isNaN(d.source2)
    );

    let xValues = filtered.map(d => d.jd);
    let yValues = filtered.map(d => d.source1);
    let yValues2 = filtered.map(d => d.source2);

    const start = xValues[0];
    let duration = xValues[xValues.length - 1] - start;

    if (duration > 60) {
      // Find first index where x - start > 60
      const cutIndex = xValues.findIndex(x => x - start > 60);

      // Slice all arrays up to that index
      const end = cutIndex !== -1 ? cutIndex : xValues.length;
      xValues = xValues.slice(0, end);
      yValues = yValues.slice(0, end);
      yValues2 = yValues2.slice(0, end);

      duration = xValues[xValues.length - 1] - start;
    }

    this.service.sonificationBrowser(xValues, yValues, yValues2, duration); 
  }
}
