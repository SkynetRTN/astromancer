import {Component, OnDestroy} from '@angular/core';
import {ChartAction} from "../../shared/types/actions";
import {HonorCodePopupService} from "../../shared/honor-code-popup/honor-code-popup.service";
import {GalaxyService} from "../galaxy.service";
import {HonorCodeChartService} from "../../shared/honor-code-popup/honor-code-chart.service";
import {MyFileParser} from "../../shared/data/FileParser/FileParser";
import {Subject, takeUntil} from "rxjs";
import {GalaxyDataDict} from "../galaxy.service.util";
import {FileType} from "../../shared/data/FileParser/FileParser.util";
import {MatDialog} from "@angular/material/dialog";
import {GalaxyChartFormComponent} from "../galaxy-chart-form/galaxy-chart-form.component";

@Component({
  selector: 'app-galaxy',
  templateUrl: './galaxy.component.html',
  styleUrls: ['./galaxy.component.scss', "../../shared/interface/tools.scss"]
})
export class GalaxyComponent implements OnDestroy {
  private static readonly RadioTxtFields: string[] = ["Freq1(MHz)", "XX1", "YY1"];
  private static readonly OpticalTxtFields: string[] = ["Freq1", "XX1", "YY1"];
  private radioFileParser: MyFileParser
    = new MyFileParser(FileType.TXT,
    GalaxyComponent.RadioTxtFields,
    [{key: "Actual_FREQ1"}],);
  private opticalFileParser: MyFileParser
    = new MyFileParser(FileType.TXT,
    GalaxyComponent.OpticalTxtFields);
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private service: GalaxyService,
    private honorCodeService: HonorCodePopupService,
    private chartService: HonorCodeChartService,
    private dialog: MatDialog) {
    this.radioFileParser.error$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(
      (error: any) => {
        //TODO: better error handling/displaying
        alert("error " + error);
      }
    );
    this.radioFileParser.data$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(
      (data: any[]) => {
        this.service.setData(
          rawDataToDataDict(data, GalaxyComponent.RadioTxtFields)
        );
      }
    );
    this.opticalFileParser.error$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(
      (error: any) => {
        alert("error " + error);
      });
    this.opticalFileParser.data$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(
      (data: any[]) => {
        this.service.setData(
          rawDataToDataDict(data, GalaxyComponent.OpticalTxtFields)
        );
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
          this.dialog.open(GalaxyChartFormComponent, {width: 'fit-content'});
        dialogRef.afterClosed().pipe().subscribe(result => {
          if (result === "saveGraph")
            this.saveGraph();
        });
      }
    })
  }

  uploadHandler($event: File) {
    this.radioFileParser.getHeaders($event, false,
      (headers, errorSubject) => {
        if (headers && Object.keys(headers).includes("Actual_FREQ1")) {
          this.radioFileParser.readFile($event, true);
        } else {
          this.opticalFileParser.readFile($event, true);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private saveGraph() {
    this.honorCodeService.honored().subscribe((name: string) => {
      this.chartService.saveImageEChartOffline(this.service.getEChart(), "galaxy", name);
    });
  }
}

function rawDataToDataDict(data: any[], fields: string[]): GalaxyDataDict[] {
  const dataDictArray: GalaxyDataDict[] = [];
  const freqArray: number[] = [];
  data.forEach((rawData: any) => {
    const freq = parseFloat(rawData[fields[0]]);
    const channel1 = parseFloat(rawData[fields[1]]);
    const channel2 = parseFloat(rawData[fields[2]]);
    if (!isNaN(freq) && !isNaN(channel1)) {
      freqArray.push(freq);
      dataDictArray.push({
        frequency: freq,
        channel1: isNaN(channel1) ? null : channel1,
        channel2: isNaN(channel2) ? null : channel2,
      });
    }
  });
  const freqRange = freqArray.length ? [Math.min(...freqArray), Math.max(...freqArray)] : [0, 0];
  // freqRange currently unused but retained for future adjustments
  return dataDictArray.length > 0 ? dataDictArray : [{frequency: null, channel1: null, channel2: null}];
}
