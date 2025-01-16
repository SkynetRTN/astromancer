import {Component, OnDestroy} from '@angular/core';
import {ChartAction} from "../../shared/types/actions";
import {HonorCodePopupService} from "../../shared/honor-code-popup/honor-code-popup.service";
import {GravityService} from "../gravity.service";
import {HonorCodeChartService} from "../../shared/honor-code-popup/honor-code-chart.service";
import {MyFileParser} from "../../shared/data/FileParser/FileParser";
import {Subject, takeUntil, withLatestFrom} from "rxjs";
import {StrainDataDict} from "../gravity.service.util";
import {FileType} from "../../shared/data/FileParser/FileParser.util";
import {MatDialog} from "@angular/material/dialog";
import {GravityChartFormComponent} from "../gravity-chart-form/gravity-chart-form.component";
import { GravityDataService } from '../gravity-data.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-gravity',
  templateUrl: './gravity.component.html',
  styleUrls: ['./gravity.component.scss', "../../shared/interface/tools.scss"]
})
export class GravityComponent implements OnDestroy {

  private destroy$: Subject<void> = new Subject<void>();

  private fileParser: MyFileParser;

  constructor(
    private service: GravityService,
    private http: HttpClient,
    private dataService: GravityDataService,
    private honorCodeService: HonorCodePopupService,
    private chartService: HonorCodeChartService,
    private dialog: MatDialog) {
      
      this.fileParser = new MyFileParser(FileType.GWF,
        [], undefined, http);

      this.fileParser.error$.pipe(
        takeUntil(this.destroy$)
      ).subscribe(
        (error: any) => {
          alert("error " + error);
        });
      
      this.fileParser.data$.pipe(
        takeUntil(this.destroy$), withLatestFrom(this.fileParser.header$)
      ).subscribe(
        ([data, headers]) => {
          
          const result: StrainDataDict[] = [];

          let dt: number, t0: number
          if(headers !== undefined) try{
            dt = parseFloat(headers["samplerate"])
            t0 = parseFloat(headers["timestart"])
          }
          catch
          {
            alert("This file had incorrectly formated headers.")
            return;
          }

          data.map((p: number[]) => {
            result.push({Time: p[0], Strain: p[1], Model: 0})
          })

          this.service.setData(result);
        });

  }

  actionHandler(actions: ChartAction[]) {
    actions.forEach((action) => {
      if (action.action === "addRow") {
        this.service.addRow(-1, 1);
      } else if (action.action === "saveGraph") {
        this.saveGraph();
      } else if (action.action === "resetData") {
        this.service.resetData();
      } else if (action.action === "editChartInfo") {
        const dialogRef =
          this.dialog.open(GravityChartFormComponent, {width: 'fit-content'});
        dialogRef.afterClosed().pipe().subscribe(result => {
          if (result === "saveGraph")
            this.saveGraph();
        });
      }
    })
  }

  uploadHandler($event: File) {
    this.fileParser.readFile($event, true, true);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private saveGraph() {
    this.honorCodeService.honored().subscribe((name: string) => {
      this.chartService.saveImageHighChartOffline(this.service.getHighChart(), "gravity", name);
    });
  }
}
