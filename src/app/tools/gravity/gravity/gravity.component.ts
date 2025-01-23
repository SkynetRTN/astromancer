import {Component, OnDestroy} from '@angular/core';
import {ChartAction} from "../../shared/types/actions";
import {HonorCodePopupService} from "../../shared/honor-code-popup/honor-code-popup.service";
import {HonorCodeChartService} from "../../shared/honor-code-popup/honor-code-chart.service";
import {MyFileParser} from "../../shared/data/FileParser/FileParser";
import {Subject, takeUntil, withLatestFrom} from "rxjs";
import {SpectogramDataDict, StrainDataDict} from "../gravity.service.util";
import {FileType} from "../../shared/data/FileParser/FileParser.util";
import {MatDialog} from "@angular/material/dialog";
import {GravityChartFormComponent} from "../gravity-chart-form/gravity-chart-form.component";
import { HttpClient } from '@angular/common/http';
import { StrainService } from '../gravity-strain.service';
import { SpectogramService } from '../gravity-spectogram.service';

@Component({
  selector: 'app-gravity',
  templateUrl: './gravity.component.html',
  styleUrls: ['./gravity.component.scss', "../../shared/interface/tools.scss"]
})
export class GravityComponent implements OnDestroy {

  private destroy$: Subject<void> = new Subject<void>();

  private fileParser: MyFileParser;

  constructor(
    private strainService: StrainService,
    private spectogramService: SpectogramService,
    private http: HttpClient,
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

      this.fileParser.error$.pipe(
        takeUntil(this.destroy$)
      ).subscribe(
        (progress: any) => {
        console.log(progress);
      });
      
      this.fileParser.data$.pipe(
        takeUntil(this.destroy$), withLatestFrom(this.fileParser.header$)
      ).subscribe(
        ([data, headers]) => {
          
          const strainResult: StrainDataDict[] = [];
          const spectogramResult: SpectogramDataDict[] = [];

          let strain = data[0]
          let spectogram: number[][] = data[1].data
          let x0 = parseFloat(data[1].x0)
          let dx = parseFloat(data[1].dx)
          let frequencies = data[1].frequencies

          strain.map((p: number[]) => {
            strainResult.push({Time: p[0], Strain: p[1], Model: 0})
          })
          this.strainService.setData(strainResult);

          this.spectogramService.setColumnSize(dx)
          spectogram.forEach( (y, i) => y.forEach( (value, j) => { 
            spectogramResult.push({x: i*dx, y: j, value: value })
          } ) )
          this.spectogramService.setData(spectogramResult)
        });

  }

  actionHandler(actions: ChartAction[]) {
    actions.forEach((action) => {
      if (action.action === "addRow") {
        this.strainService.addRow(-1, 1);
      } else if (action.action === "saveGraph") {
        this.saveGraph();
      } else if (action.action === "resetData") {
        this.strainService.resetData();
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
      this.chartService.saveImageHighChartOffline(this.strainService.getHighChart(), "gravity", name);
    });
  }
}
