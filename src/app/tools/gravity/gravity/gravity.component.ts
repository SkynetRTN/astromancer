import {Component, OnDestroy} from '@angular/core';
import {ChartAction} from "../../shared/types/actions";
import {HonorCodePopupService} from "../../shared/honor-code-popup/honor-code-popup.service";
import {HonorCodeChartService} from "../../shared/honor-code-popup/honor-code-chart.service";
import {MyFileParser} from "../../shared/data/FileParser/FileParser";
import {debounce, debounceTime, Subject, takeUntil, withLatestFrom} from "rxjs";
import {fitValuesToGrid, ModelDataDict, SpectogramDataDict, StrainDataDict} from "../gravity.service.util";
import {FileType} from "../../shared/data/FileParser/FileParser.util";
import {MatDialog} from "@angular/material/dialog";
import {GravityChartFormComponent} from "../gravity-chart-form/gravity-chart-form.component";
import { HttpClient } from '@angular/common/http';
import { StrainService } from '../gravity-strain.service';
import { SpectogramService } from '../gravity-spectogram.service';
import { InterfaceService } from '../gravity-interface.service';
import { UpdateSource } from '../../shared/data/utils';
import { environment } from 'src/environments/environment';

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
    private interfaceService: InterfaceService,
    private http: HttpClient,
    private honorCodeService: HonorCodePopupService,
    private chartService: HonorCodeChartService,
    private dialog: MatDialog) {
      
      //File upload
      this.fileParser = new MyFileParser(FileType.GWF,
        [], undefined, http);

      this.fileParser.error$.pipe(
        takeUntil(this.destroy$)
      ).subscribe(
        (error: any) => {
          alert("error " + error);
        });

      this.fileParser.progress$.pipe(
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
          let axes = data[1].axes

          console.log(axes)

          let xmin = parseFloat(axes.x[0])
          let xmax = parseFloat(axes.x[1])
          let dx   = parseFloat(axes.x[2])
          let ymin = axes.y[0]
          let ymax = axes.y[1]

          strain.map((p: number[]) => {
            strainResult.push({Time: p[0], Strain: p[1]})
          })
          this.strainService.setData(strainResult);

          this.spectogramService.setAxes({'dx': dx, 'xmin': xmin, 'xmax': xmax, 'ymin': ymin, 'ymax': ymax})
          spectogram.forEach( (y, i) => y.forEach( (value, j) => { 
            spectogramResult.push({x: i*dx + xmin , y: j, value: value })
          } ) )
          this.spectogramService.setSpecto(spectogramResult)
        });

      this.interfaceService.serverParameters$.pipe(
        takeUntil(this.destroy$),
        debounceTime(200)
      ).subscribe(
        (source: UpdateSource) => {
          //don't make a request before the user has a chance to fiddle with the interface
          if(source==UpdateSource.INIT) return;
  
          this.fetchModels(this.interfaceService.getTotalMass(),
                          this.interfaceService.getMassRatio(),
                          this.interfaceService.getPhaseShift())
        }
      )

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

  private fetchModels(totalMass: number, massRatio: number, phase: number) {
  
    let payload = fitValuesToGrid(totalMass,massRatio,phase)

    let freqMassError = totalMass/payload.total_mass_freq

    this.http.get(
      `${environment.apiUrl}/gravity/model`,
        {'params': payload}).subscribe(
          (resp: any) => {
            let strainModel: StrainDataDict[] = []
            let freqModel: ModelDataDict[] = []
            
            resp.frequency.forEach((p: number[]) => {
              if(p[0] != null && p[1] != null)
              {
                freqModel.push({ 'Time': p[0]*freqMassError, 'Frequency': p[1]/freqMassError})
              }
            })
            // freqModel.sort((a,b) =>  +(a.Time as number) - +(b.Time as number))

            this.spectogramService.setModel(freqModel)

            resp.strain.forEach((p: number[]) => {
              if(p[0] != null && p[1] != null)
              {
                strainModel.push({ 'Time': p[0], 'Strain': p[1]})
              }
            })

            // strainModel.sort((a,b) =>  +(a.Time as number) - +(b.Time as number))

            this.strainService.setModelData(strainModel)
          }
        )
  }
}