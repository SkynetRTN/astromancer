import {Component, OnDestroy} from '@angular/core';
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

@Component({
  selector: 'app-pulsar-light-curve',
  templateUrl: './pulsar-light-curve.component.html',
  styleUrls: ['./pulsar-light-curve.component.scss', '../../../shared/interface/tools.scss']
})
export class PulsarLightCurveComponent implements OnDestroy {
  private destroy$ = new Subject<void>();
  ts: number[] = [];
  xs: number[] = [];
  ys: number[] = [];
//private fileParser: MyFileParser = new MyFileParser(FileType.TXT,);

  constructor(private service: PulsarService,
              private honorCodeService: HonorCodePopupService,
              private chartService: HonorCodeChartService,
              public dialog: MatDialog) {
                /*
    this.fileParser.error$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(
      (error: any) => {
        alert("error " + error);
      });
    this.fileParser.data$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(
      (data: any) => {
        const sources = Array.from(new Set(data.map((d: any) => d.id)));
        console.log(sources);
        if (sources.length < 2) {
          alert("Error" + "Please upload at least two sources")
          return;
        }
          
        const result: PulsarDataDict[] = [];
        const src0data = data.filter((d: any) => d.id === sources[0])
          .map((d: any) => [parseFloat(d.mjd), parseFloat(d.mag), parseFloat(d.mag_error)])
          .filter((d: any) => !isNaN(d[0]) && !isNaN(d[1]) && !isNaN(d[2]))
          .sort((a: any, b: any) => a[0] - b[0]);
        const src1data = data.filter((d: any) => d.id === sources[1])
          .map((d: any) => [parseFloat(d.mjd), parseFloat(d.mag), parseFloat(d.mag_error)])
          .filter((d: any) => !isNaN(d[0]) && !isNaN(d[1]) && !isNaN(d[2]))
          .sort((a: any, b: any) => a[0] - b[0]);
        let left = 0;
        let right = 0;
        const mjdThreshold = 0.00000001;
        while (left < src0data.length && right < src1data.length) {
          if (Math.abs(src0data[left][0] - src1data[right][0]) < mjdThreshold) {
            result.push({
              jd: src0data[left][0] as number,
              source1: src0data[left][1] as number,
              source2: src1data[right][1] as number,
            });
            left++;
            right++;
          } else if (src0data[left][0] < src1data[right][0]) {
            result.push({
              jd: src0data[left][0] as number,
              source1: src0data[left][1] as number,
              source2: null,

            });
            left++;
          } else {
            result.push({
              jd: src1data[right][0] as number,
              source1: null,
              source2: src1data[right][1] as number,
            });
            right++;
          }
        }
        while (left < src0data.length) {
          result.push({
            jd: src0data[left][0] as number,
            source1: src0data[left][1] as number,
            source2: null,

          });
          left++;
        }
        while (right < src1data.length) {
          result.push({
            jd: src1data[right][0] as number,
            source1: null,
            source2: src1data[right][1] as number,

          });
          right++;
        }
        this.service.setData(result);
      }); */
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
          this.dialog.open(PulsarLightCurveChartFormComponent, {width: 'fit-content'});
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
          if (file[0].slice(0, 7) == "# Input")
              type = "pressto";

          else
              type = "standard";
      

        // Filter out comment lines starting with #
        let filteredLines = lines.filter(line => !line.startsWith('#') && line.trim() !== '');
        filteredLines = filteredLines.filter(line => !line.endsWith('0 '));
  
        
        if (type == "pressto" ) {
          this.service.setTabIndex(2); // Set tab index to period folding tab
          this.service.setLightCurveOptionValid(true); 
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
        this.service.setData(combinedData);
        let chartData = combinedData
    
        const jd = chartData.map(item => item.jd);
        const source1 = chartData.map(item => item.source1);
        const source2 = chartData.map(item => item.source2);
        const subtractedsource1 = this.service.backgroundSubtraction(jd, source1, this.service.getbackScale());
        const subtractedsource2 = this.service.backgroundSubtraction(jd, source2, this.service.getbackScale());
        chartData = chartData.map((item, index) => ({
            ...item,
            source1: subtractedsource1[index],
            source2: subtractedsource2[index],

          }));   
          this.service.setData(chartData);
        };
        reader.readAsText($event); // Read the file as text
       
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
