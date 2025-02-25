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

@Component({
  selector: 'app-pulsar-light-curve',
  templateUrl: './pulsar-light-curve.component.html',
  styleUrls: ['./pulsar-light-curve.component.scss', '../../../shared/interface/tools.scss']
})
export class PulsarLightCurveComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  ts: number[] = [];
  xs: number[] = [];
  ys: number[] = [];
  rawData: PulsarDataDict[] = [];
  private backScaleSubject = new BehaviorSubject<number>(3); // Default value 3
  backScale$ = this.backScaleSubject.asObservable();

  constructor(private service: PulsarService,
              private honorCodeService: HonorCodePopupService,
              private chartService: HonorCodeChartService,
              public dialog: MatDialog) {}

  ngOnInit(): void {
    // Subscribe to backScale value changes
    this.service.backScale$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      const backScale = this.service.getbackScale();
      console.log("backscale changed", backScale);
      this.rawData = this.service.getCombinedData();
      this.processChartData(backScale); // Call processChartData with the new backScale value
    });
  }

  actionHandler(actions: TableAction[]) {
    actions.forEach((action) => {
      if (action.action === "addRow") {
        this.service.addRow(-1, 1);
      } else if (action.action === "saveGraph") {
        this.saveGraph();
      } else if (action.action === "resetData") {
        this.service.resetData();
      } else if (action.action === "editChartInfo") {
        const dialogRef =
          this.dialog.open(PulsarLightCurveChartFormComponent, { width: 'fit-content' });
        dialogRef.afterClosed().pipe().subscribe(result => {
          if (result === "saveGraph")
            this.saveGraph();
        });
      }
    })
  }

  uploadHandler($event: File) {
    console.log("uploadHandler");
    const reader = new FileReader();
    reader.onload = () => {
      const file = reader.result as string;

      // Split the file into lines
      const lines = file.split('\n');
      let type = "standard";
      if (lines[0].slice(0, 7) == "# Input")
        type = "pressto";
      else
        type = "standard";

      // Filter out comment lines starting with #
      let filteredLines = lines.filter(line => !line.startsWith('#') && line.trim() !== '');
      filteredLines = filteredLines.filter(line => !line.endsWith('0 '));

      if (type == "pressto") {
        console.log("Pressto file detected");
        this.service.setTabIndex(2); // Set tab index to period folding tab
        this.service.setLightCurveOptionValid(false);
      }

      // Extract headers and data rows
      const headers = [
        'UTC_Time(s)', 'Ra(hr)', 'Dec(deg)', 'Az(deg)', 'El(deg)',
        'YY1', 'XX1', 'Cal', 'Sweeps'
      ];

      const rows = filteredLines.map(line => {
        // Replace multiple spaces with a single space, then split by space
        const columns = line.trim().replace(/\s+/g, ' ').split(' ');

        // Map data to headers
        const row: Record<string, string | number> = {};
        headers.forEach((header, index) => {
          row[header] = isNaN(Number(columns[index])) ? columns[index] : Number(columns[index]);
        });

        return row;
      });

      console.log('Headers:', headers);
      console.log('Rows:', rows);

      // Prepare data for computation
      this.ts = rows.map(row => row['UTC_Time(s)'] as number);
      this.ys = rows.map(row => row['YY1'] as number);
      this.xs = rows.map(row => row['XX1'] as number);

      const combinedData = rows.map(row => ({
        jd: row['UTC_Time(s)'] as number,
        source1: row['YY1'] as number,
        source2: row['XX1'] as number
      }));

      this.rawData = combinedData;
      this.service.setData(combinedData);
      this.service.setCombinedData(combinedData);
      let chartData = combinedData;

      const jd = chartData.map(item => item.jd);
      const source1 = chartData.map(item => item.source1);
      const source2 = chartData.map(item => item.source2);

      const subtractedsource1 = this.service.backgroundSubtraction(jd, source1, this.service.getbackScale());
      const subtractedsource2 = this.service.backgroundSubtraction(jd, source2, this.service.getbackScale());

      chartData = chartData.map((item, index) => ({
        jd: jd[index],
        source1: subtractedsource1[index],
        source2: subtractedsource2[index],
      }));
      this.service.setData(chartData);
    };
    reader.readAsText($event); // Read the file as text
  }

  processChartData(backScale: number): void {
    if (!this.rawData) {
      console.log("No data available");
      return; // Exit early if no data is available
    }

    let chartData = this.rawData;

    // Extract data for processing
    const jd = chartData.map(item => item.jd ?? 0);
    const source1 = chartData.map(item => item.source1 ?? 0);
    const source2 = chartData.map(item => item.source2 ?? 0);

    // Apply background subtraction based on the provided backScale
    const subtractedSource1 = this.service.backgroundSubtraction(jd, source1, backScale);
    const subtractedSource2 = this.service.backgroundSubtraction(jd, source2, backScale);

    // Update chart data with background-subtracted values
    chartData = chartData.map((item, index) => ({
      jd: jd[index],
      source1: subtractedSource1[index],
      source2: subtractedSource2[index],
    }));

    console.log(backScale, "new data", chartData);
    // Set updated data back to the service
    this.service.setData(chartData);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private saveGraph() {
    this.honorCodeService.honored().subscribe((name: string) => {
      this.chartService.saveImageHighChartOffline(this.service.getHighChartLightCurve(), "Pulsar Light Curve", name);
    })
  }
}