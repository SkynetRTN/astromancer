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
      } else if (action.action === "resetGraphInfo") {
        this.resetGraphInfo();
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
    const reader = new FileReader();
    reader.onload = () => {
      const file = reader.result as string;

      // Split the file into lines
      const lines = file.split('\n');
      let type = "cal";
      if (lines[0].slice(0, 7) == "# Input") {
        type = "standard";
        this.service.setLightCurveOptionValid(false);
      
        const lines = file.replace(/\r\n/g, '\n').split('\n'); 

        let period: number | null = null;
        for (const line of lines) {
          if (line.startsWith('# P_topo')) {
            const match = line.match(/P_topo\s*\(ms\)\s*=\s*([\d.]+)/);
            if (match) {
              period = parseFloat(match[1]);
              if (!isNaN(period)) {
                this.service.setPeriodFoldingPeriod(Math.round((period / 1000) * 10000) / 10000);
              }
            }
            break;
          }
        }

        const xvalues: number[] = [];
        const yvalues: number[] = [];
        
        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed === '' || trimmed.startsWith('#')) continue;
        
          const parts = trimmed.split(/\s+/);
          if (parts.length >= 2) {
            const x = parseFloat(parts[0].trim());
            const y = parseFloat(parts[1].trim());
        
            if (!isNaN(x) && !isNaN(y)) {
              xvalues.push(x);
              yvalues.push(y);
            } else {
              console.warn('Could not parse:', parts);
            }
          } else {
            console.warn('Skipping malformed line:', line);
          }
        }        
      
        const combinedData = xvalues.map((x, i) => ({
          jd: x,
          source1: yvalues[i],
          source2: null,
        }));
      
        this.rawData = combinedData;
        this.service.setData(combinedData);
        this.service.setCombinedData(combinedData);
      
        const jd = combinedData.map(item => item.jd);
        const source1 = combinedData.map(item => item.source1);
      
        const chartData = combinedData.map((item, index) => ({
          jd: jd[index],
          source1: source1[index],
          source2: 0,
        }));
      
        this.service.setData(chartData);
      } else {
        type = "cal";
          
        let filteredLines = lines.filter(line => !line.startsWith('#') && line.trim() !== '');
        filteredLines = filteredLines.filter(line => !line.endsWith('0 '));

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
  
  private resetGraphInfo(){
    this.service.setChartTitle("Title")
    this.service.setXAxisLabel("x")
    this.service.setYAxisLabel("y")
  }
}