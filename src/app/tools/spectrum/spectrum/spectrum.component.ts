import {Component, OnDestroy} from '@angular/core';
import {ChartAction} from "../../shared/types/actions";
import {HonorCodePopupService} from "../../shared/honor-code-popup/honor-code-popup.service";
import {SpectrumService} from "../spectrum.service";
import {HonorCodeChartService} from "../../shared/honor-code-popup/honor-code-chart.service";
import {MyFileParser} from "../../shared/data/FileParser/FileParser";
import {Subject, takeUntil} from "rxjs";
import {SpectrumDataDict} from "../spectrum.service.util";
import {FileType} from "../../shared/data/FileParser/FileParser.util";
import {MatDialog} from "@angular/material/dialog";
import {SpectrumChartFormComponent} from "../spectrum-chart-form/spectrum-chart-form.component";

@Component({
  selector: 'app-spectrum',
  templateUrl: './spectrum.component.html',
  styleUrls: ['./spectrum.component.scss', "../../shared/interface/tools.scss"]
})
export class SpectrumComponent implements OnDestroy {
  private static readonly RadioTxtFields: string[] = ["Freq1(MHz)", "XX1", "YY1"];
  private static readonly OpticalTxtFields: string[] = ["Freq1", "XX1", "YY1"];
  private radioFileParser: MyFileParser
    = new MyFileParser(FileType.TXT,
    SpectrumComponent.RadioTxtFields,
    [{key: "Actual_FREQ1"}],);
  private opticalFileParser: MyFileParser
    = new MyFileParser(FileType.TXT,
    SpectrumComponent.OpticalTxtFields);
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private service: SpectrumService,
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
          rawDataToDataDict(data, SpectrumComponent.RadioTxtFields, [21.085, 21.125])
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
          rawDataToDataDict(data, SpectrumComponent.OpticalTxtFields, [4966, 6545.6])
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
          this.dialog.open(SpectrumChartFormComponent, {width: 'fit-content'});
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
      this.chartService.saveImageHighChartOffline(this.service.getHighChart(), "spectrum", name);
    });
  }
}

function rawDataToDataDict(data: any[], fields: string[], wlRange: number[]): SpectrumDataDict[] {
  const dataDictArray: SpectrumDataDict[] = [];
  data.map((rawData: any) => {
    const freq = parseFloat(rawData[fields[0]]);
    const channel1 = parseFloat(rawData[fields[1]]);
    const channel2 = parseFloat(rawData[fields[2]]);
    if (!isNaN(freq) && !isNaN(channel1)) {
      const wl = 299792458 / (freq * 1e4);
      if (wl >= wlRange[0] && wl <= wlRange[1]) {
        dataDictArray.push({
          wavelength: wl,
          channel1: isNaN(channel1) ? null : channel1,
          channel2: isNaN(channel2) ? null : channel2,
        })
      }
    }
  });
  return dataDictArray.length > 0 ? dataDictArray : [{wavelength: null, channel1: null, channel2: null}];
}

