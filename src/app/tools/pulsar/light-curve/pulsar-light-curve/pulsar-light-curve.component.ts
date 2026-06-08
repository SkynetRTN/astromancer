import { Component } from '@angular/core';
import {TableAction} from "../../../shared/types/actions";
import {PulsarService} from "../../pulsar.service";
import {HonorCodePopupService} from "../../../shared/honor-code-popup/honor-code-popup.service";
import {HonorCodeChartService} from "../../../shared/honor-code-popup/honor-code-chart.service";
import {PulsarDataDict} from "../../pulsar.service.util";
import {MatDialog} from "@angular/material/dialog";
import {
  PulsarLightCurveChartFormComponent
} from "../pulsar-light-curve-chart-form/pulsar-light-curve-chart-form.component";
@Component({
  selector: 'app-pulsar-light-curve',
  templateUrl: './pulsar-light-curve.component.html',
  styleUrls: ['./pulsar-light-curve.component.scss', '../../../shared/interface/tools.scss']
})
export class PulsarLightCurveComponent {
  ts: number[] = [];
  xs: number[] = [];
  ys: number[] = [];
  chartData: {jd: number, source1: number, source2: number}[] = [];
  calFile: boolean = false;
  rawData: PulsarDataDict[] = [];

  constructor(private service: PulsarService,
              private honorCodeService: HonorCodePopupService,
              private chartService: HonorCodeChartService,
              public dialog: MatDialog) {}

  actionHandler(actions: TableAction[]) {
    actions.forEach((action) => {
      if (action.action === "addRow") {
        // splice(-1, ...) inserts before the last element; pass length to append.
        this.service.addRow(this.service.getData().length, 1);
      } else if (action.action === "saveGraph") {
        this.saveGraph();
      } else if (action.action === "resetData") {
        this.service.setRawData(this.service.getCombinedData())
        this.rawData = this.service.getRawData();
        this.processChartData(this.service.getbackScale());
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
      this.service.clearPeriodogramChart()

      const file = reader.result as string;
      
      const lines = file.split('\n');
      let type = "cal";
      if (lines[0].slice(0, 7) == "# Input") {
        type = "standard";
        this.calFile = false;
        this.service.setLightCurveOptionValid(false);
        // Reset background scale so prior tuning doesn't carry over.
        this.service.setbackScale(3);
      
        const lines = file.replace(/\r\n/g, '\n').split('\n'); 

        let period: number | null = null;
        for (const line of lines) {
          const trimmed = line.replace(/^#\s*/, ''); // remove leading '#' and spaces

          // Extract P_topo
          if (trimmed.startsWith('P_topo')) {
            const match = trimmed.match(/P_topo\s*\(ms\)\s*=\s*([\d.]+)/);
            if (match) {
              const period = parseFloat(match[1]);
              if (!isNaN(period)) {
                this.service.setPeriodFoldingPeriod(Math.round((period / 1000) * 10000) / 10000);
              }
            }
          }

          // Extract Candidate
          else if (trimmed.startsWith('Candidate')) {
            const match = trimmed.match(/Candidate\s*=\s*(.+)/);
            if (match) {
              this.service.setChartTitle(match[1].trim());
              this.service.setPeriodFoldingTitle(match[1].trim());
            }
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
        this.service.setPeriodFoldingSpeed(1);

        // Compute Nyquist from the time values so the period-folding slider
        // floor matches the data's effective sample resolution, matching
        // the same rule as the cal-file branch (Nyquist … 10 s default).
        if (xvalues.length >= 2) {
          let totalDiff = 0;
          for (let i = 1; i < xvalues.length; i++) {
            totalDiff += xvalues[i] - xvalues[i - 1];
          }
          const avgDiff = Math.round(totalDiff / (xvalues.length - 1) * 2 * 100000) / 100000;
          this.service.setPeriodFoldingPeriodMin(avgDiff);
          this.service.setPeriodFoldingPeriodMax(10);
        }

        // Standard / prefolded files only have meaningful content in the
        // period folding tab — push the user there immediately. The
        // lightCurveOptionValid$ subscription already drives the tab via
        // pulsarTabindex, but this explicit call also persists the choice
        // to storage so a subsequent refresh lands on the right tab.
        this.service.setTabIndex(2);
      } else {
        type = "cal";
        this.calFile = true;
        // A previous standard-file upload may have disabled the light-curve
        // and periodogram tabs. Re-enable them now that we're loading a
        // dual-source cal file.
        this.service.setLightCurveOptionValid(true);
        // Reset background scale so prior tuning doesn't carry over. Must
        // happen before backgroundSubtraction below so it uses the default.
        this.service.setbackScale(3);
        
        let filteredLines = lines
          .filter(line => !line.startsWith('#') && line.trim() !== '') 
          .filter(line => {
            const columns = line.trim().split(/\s+/);
            const lastValue = parseFloat(columns[columns.length - 1]);
            return lastValue !== 0;
          });
        let commentLines = lines.filter(line => line.startsWith('#'));
          
        let period: number | null = null;
        let srcName: string | null = null;
        let utc: number | null = null;
        let utcString: string | null = null;
        let dateObs: string | null = null;

        for (const line of commentLines) {
          const trimmed = line.replace(/^#\s*/, ''); // remove '#' and any spaces after it

          if (trimmed.startsWith('P_topo')) {
            const match = trimmed.match(/P_topo\s*\(ms\)\s*=\s*([\d.]+)/);
            if (match) {
              period = parseFloat(match[1]);
              if (!isNaN(period)) {
                this.service.setPeriodFoldingPeriod(
                  Math.round((period / 1000) * 10000) / 10000
                );
              }
            }

          } else if (trimmed.startsWith('SRC_NAME=')) {
            const match = trimmed.match(/SRC_NAME=([^\s#]+)/);
            if (match) {
              srcName = match[1];
            }

          } else if (trimmed.startsWith('UTC=')) {
            const match = trimmed.match(/UTC=([\d.]+)/);
            if (match) {
              utc = parseFloat(match[1]);

              if (!isNaN(utc)) {
                const hours = Math.floor(utc / 3600);
                const minutes = Math.floor((utc % 3600) / 60);
                const seconds = Math.floor(utc % 60);
                utcString =
                  `${hours.toString().padStart(2, '0')}:` +
                  `${minutes.toString().padStart(2, '0')}:` +
                  `${seconds.toString().padStart(2, '0')}`;
              }
            }

          } else if (trimmed.startsWith('DATE_OBS=')) {
            const match = trimmed.match(/DATE_OBS=([^\s#]+)/);
            if (match) {
              dateObs = match[1];
            }
          }
        }

        if (utcString && srcName) {
          this.service.setChartTitle(srcName + '_' + dateObs + '_prefolded_light_curve');
          this.service.setPeriodogramTitle(srcName + '_' + dateObs + '_periodogram');
          this.service.setPeriodFoldingTitle(srcName + '_' + dateObs + '_folded_light_curve');
        };

        // Extract headers and data rows
        const headers = [
          'UTC_Time(s)', 'Ra(hr)', 'Dec(deg)', 'Az(deg)', 'El(deg)',
          'XX1', 'YY1', 'Cal', 'Sweeps'
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
        const filteredRows = rows.filter(row =>
          !isNaN(row['UTC_Time(s)'] as number) &&
          !isNaN(row['YY1'] as number) &&
          !isNaN(row['XX1'] as number)
        );

        this.ts = filteredRows.map(row => (row['UTC_Time(s)'] as number) - (utc ?? 0));
        this.ys = filteredRows.map(row => row['YY1'] as number);
        this.xs = filteredRows.map(row => row['XX1'] as number);

        const combinedData = filteredRows.map(row => ({
          jd: (row['UTC_Time(s)'] as number) - (utc ?? 0),
          source1: row['YY1'] as number,
          source2: row['XX1'] as number
        }));

        // A cal file with 0 or 1 valid rows would produce NaN / -0 / Infinity
        // here and persist that bad value into localStorage as the periodogram
        // bounds. Skip the update if there isn't enough data to estimate a
        // sampling interval.
        if (this.ts.length >= 2) {
          let totalDiff = 0;
          for (let i = 1; i < this.ts.length; i++) {
            totalDiff += this.ts[i] - this.ts[i - 1];
          }

          // Nyquist = 2× average sample interval; the shortest meaningful
          // period the data can resolve.
          const avgDiff = Math.round(totalDiff / (this.ts.length - 1) * 2 * 100000) / 100000;

          if (this.service.getPeriodogramMethod()) {
            // Frequency mode: start = 1/default-max-period (0.1 Hz),
            // end = Nyquist frequency (1/avgDiff).
            this.service.setPeriodogramStartPeriod(0.1);
            this.service.setPeriodogramEndPeriod(Math.round((1 / avgDiff) * 100000) / 100000);
          } else {
            // Period mode: start = Nyquist period, end = default max (10s).
            // The end no longer tracks the observation length.
            this.service.setPeriodogramStartPeriod(avgDiff);
            this.service.setPeriodogramEndPeriod(3);
          }

          // Period folding slider always in seconds; same bracket as the
          // periodogram defaults so the two views agree on what's meaningful.
          this.service.setPeriodFoldingPeriodMin(avgDiff);
          this.service.setPeriodFoldingPeriodMax(3);
        }

        this.rawData = combinedData;
        this.service.setData(combinedData);
        this.service.setRawData(combinedData);
        this.service.setCombinedData(combinedData);
        
        this.chartData = combinedData;

        const jd = this.chartData.map(item => item.jd);
        const source1 = this.chartData.map(item => item.source1);
        const source2 = this.chartData.map(item => item.source2);

        const subtractedsource1 = this.service.backgroundSubtraction(jd, source1, this.service.getbackScale());
        const subtractedsource2 = this.service.backgroundSubtraction(jd, source2, this.service.getbackScale());

        this.chartData = this.chartData.map((item, index) => ({
          jd: jd[index],
          source1: subtractedsource1[index],
          source2: subtractedsource2[index],
        }));
        this.service.setData(this.chartData);
      };
    };
    reader.readAsText($event); // Read the file as text
  }

  processChartData(backScale: number): void {
    if (!this.rawData) {
      return;
    }

    let chartData = this.rawData;

    // Extract data for processing
    const jd = chartData.map(item => item.jd ?? 0);
    const source1 = chartData.map(item => item.source1 ?? 0);
    const source2 = chartData.map(item => item.source2 ?? 0);

    // Apply background subtraction based on the provided backScale
    const subtractedSource1 = this.service.backgroundSubtraction(jd, source1, backScale);
    const subtractedSource2 = this.service.backgroundSubtraction(jd, source2, backScale);

    this.service.setbackScale(backScale)

    // Update chart data with background-subtracted values
    chartData = chartData.map((item, index) => ({
      jd: jd[index],
      source1: subtractedSource1[index],
      source2: subtractedSource2[index],
    }));

    this.service.setData(chartData);
  }

  private saveGraph() {
    this.honorCodeService.honored().subscribe((name: string) => {
      this.chartService.saveImageHighChartOffline(this.service.getHighChartLightCurve(), "Pulsar Light Curve", name);
    })
  }
}