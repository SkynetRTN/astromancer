import {Component, OnDestroy} from '@angular/core';
import {ChartAction} from "../../shared/types/actions";
import {HonorCodePopupService} from "../../shared/honor-code-popup/honor-code-popup.service";
import {SpectrumService} from "../spectrum.service";
import {HonorCodeChartService} from "../../shared/honor-code-popup/honor-code-chart.service";
import {FileType, MyFileParser} from "../../shared/data/FileParser";
import {Subject, takeUntil} from "rxjs";
import {SpectrumDataDict} from "../spectrum.service.util";

@Component({
  selector: 'app-spectrum',
  templateUrl: './spectrum.component.html',
  styleUrls: ['./spectrum.component.scss']
})
export class SpectrumComponent implements OnDestroy {
  private static readonly SPECTRUM_GBO_FIELDS: string[] = ["Freq1(MHz)", "XX1", "YY1"];
  private fileParser: MyFileParser
    = new MyFileParser(FileType.GBO_SPECTRUM_TXT,
    SpectrumComponent.SPECTRUM_GBO_FIELDS,
    [{key: "Actual_FREQ1"}],);
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private service: SpectrumService,
    private honorCodeService: HonorCodePopupService,
    private chartService: HonorCodeChartService,) {
    this.fileParser.error$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(
      (error: any) => {
        alert("error " + error);
      }
    );
    this.fileParser.data$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(
      (data: any[]) => {
        const dataDictArray: SpectrumDataDict[] = [];
        data.map((rawData: any) => {
          const freq = parseFloat(rawData[SpectrumComponent.SPECTRUM_GBO_FIELDS[0]]);
          const channel1 = parseFloat(rawData[SpectrumComponent.SPECTRUM_GBO_FIELDS[1]]);
          const channel2 = parseFloat(rawData[SpectrumComponent.SPECTRUM_GBO_FIELDS[2]]);
          if (!isNaN(freq) && !isNaN(channel1)) {
            const wl = 299792458 / (freq * 1e4);
            if (wl >= 21.085 && wl <= 21.125) {
              dataDictArray.push({
                wavelength: wl,
                channel1: isNaN(channel1) ? null : channel1,
                channel2: isNaN(channel2) ? null : channel2,
              })
            }
          }
        });
        this.service.setData(dataDictArray);
      }
    );
  }

  actionHandler(actions: ChartAction[]) {
    actions.forEach((action) => {
      if (action.action === "addRow") {
        this.service.addRow(-1, 1);
      } else if (action.action === "saveGraph") {
        this.honorCodeService.honored().subscribe((name: string) => {
          this.chartService.saveImageHighChartOffline(this.service.getHighChart(), "spectrum", name);
        })
      } else if (action.action === "resetData") {
        this.service.resetData();
      } else if (action.action === "resetChartInfo") {
        this.service.resetChartInfo();
      }
    })
  }

  uploadHandler($event: File) {
    this.fileParser.readFile($event, true);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
