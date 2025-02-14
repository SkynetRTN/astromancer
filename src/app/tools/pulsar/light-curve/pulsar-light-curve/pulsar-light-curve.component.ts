import { Component, OnDestroy, OnInit } from '@angular/core';
import { TableAction } from "../../../shared/types/actions";
import { PulsarService } from "../../pulsar.service";
import { HonorCodePopupService } from "../../../shared/honor-code-popup/honor-code-popup.service";
import { HonorCodeChartService } from "../../../shared/honor-code-popup/honor-code-chart.service";
import { Subject, takeUntil } from "rxjs";
import { PulsarDataDict } from "../../pulsar.service.util";
import { MatDialog } from "@angular/material/dialog";
import { PulsarLightCurveChartFormComponent } from "../pulsar-light-curve-chart-form/pulsar-light-curve-chart-form.component";

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

  constructor(private service: PulsarService,
              private honorCodeService: HonorCodePopupService,
              private chartService: HonorCodeChartService,
              public dialog: MatDialog) {}

  ngOnInit(): void {
    // Subscribe to backScale value changes
    this.service.backScale$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      const combinedData = this.service.getCombinedData();
      console.log("backscale changed");
      this.backscaled(combinedData);
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
    const reader = new FileReader();
    reader.onload = () => {
      const file = reader.result as string;

      // Split the file into lines
      const lines = file.split('\n');
      let type = "standard";
      if (file.slice(0, 7) == "# Input")
        type = "pressto";
      else
        type = "standard";

      // Filter out comment lines starting with #
      let filteredLines = lines.filter(line => !line.startsWith('#') && line.trim() !== '');
      filteredLines = filteredLines.filter(line => !line.endsWith('0 '));

      if (type == "pressto") {
        console.log("Pressto file detected");
        this.service.setLightCurveOptionValid(true); // Set tab index to period folding tab
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
      console.log("I will now set combined data");
      const combinedData = rows.map(row => ({
        frequency: row['UTC_Time(s)'] as number,
        channel1: row['YY1'] as number,
        channel2: row['XX1'] as number,
      }));

      this.service.setCombinedData(combinedData);
      console.log(combinedData);
      //this.service.setData(combinedData);
      this.backscaled(combinedData);
    };
    reader.readAsText($event); // Read the file as text
  }

  backscaled(combinedData: PulsarDataDict[]): void {
    let chartData = combinedData;
    //console.log("I am in backscaled", chartData);

    const jd = chartData.map(item => item.frequency).filter((value): value is number => value !== null);
    const source1 = chartData.map(item => item.channel1).filter((value): value is number => value !== null);
    const source2 = chartData.map(item => item.channel2).filter((value): value is number => value !== null);
    const subtractedsource1 = this.service.backgroundSubtraction(jd, source1, this.service.getbackScale());
    const subtractedsource2 = this.service.backgroundSubtraction(jd, source2, this.service.getbackScale());
    chartData = chartData.map((item, index) => ({
      ...item,
      frequency: jd[index],
      channel1: subtractedsource1[index],
      channel2: subtractedsource2[index],
    }));
   // console.log("I updated chartdate", chartData);
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