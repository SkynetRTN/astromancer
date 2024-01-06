import {Injectable} from '@angular/core';
import {IsochroneParams, PlotConfig, PlotFraming, PlotParams} from "../cluster.util";
import {ClusterStorageService} from "../storage/cluster-storage.service";
import {Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {ClusterService} from "../cluster.service";

@Injectable()
export class ClusterIsochroneService {
  public plotParamsSubject: Subject<PlotParams> = new Subject<PlotParams>();
  public plotParams$ = this.plotParamsSubject.asObservable();
  public isochroneParamsSubject: Subject<IsochroneParams> = new Subject<IsochroneParams>();
  public isochroneParams$ = this.isochroneParamsSubject.asObservable();
  public maxMagErrorSubject: Subject<number> = new Subject<number>();
  public maxMagError$ = this.maxMagErrorSubject.asObservable();
  private plotConfigs: PlotConfig[];
  private plotParams: PlotParams;
  private isochroneParams: IsochroneParams;
  private maxMagError: number;
  private addPlotConfigSubject: Subject<PlotConfig[]> = new Subject<PlotConfig[]>();
  public addPlotConfig$ = this.addPlotConfigSubject.asObservable();
  private plotConfigSubject: Subject<PlotConfig[]> = new Subject<PlotConfig[]>();
  public plotConfig$ = this.plotConfigSubject.asObservable();

  constructor(private http: HttpClient, private service: ClusterService, private storageService: ClusterStorageService) {
    this.plotConfigs = this.storageService.getPlotConfigs();
    this.plotParams = this.storageService.getPlotParams();
    this.isochroneParams = this.storageService.getIsochroneParams();
    this.maxMagError = this.storageService.getMaxMagError();
  }

  public getIsochroneParams() {
    return this.isochroneParams;
  }

  public setIsochroneParams(isochroneParams: IsochroneParams) {
    if (isochroneParams) {
      this.isochroneParams.age = parseFloat(isochroneParams.age as any);
      this.isochroneParams.metallicity = parseFloat(isochroneParams.metallicity as any);
    } else {
      this.isochroneParams = isochroneParams;
    }
    this.storageService.setIsochroneParams(isochroneParams);
    this.isochroneParamsSubject.next(this.isochroneParams);
  }

  public getMaxMagError() {
    return this.maxMagError;
  }

  public setMaxMagError(maxMagError: number) {
    this.maxMagError = maxMagError;
    this.storageService.setMaxMagError(maxMagError);
    this.maxMagErrorSubject.next(this.maxMagError);
  }

  public getPlotParams() {
    return this.plotParams;
  }

  public setPlotParams(plotParams: PlotParams) {
    if (plotParams) {
      this.plotParams.distance = parseFloat(plotParams.distance as any);
      this.plotParams.reddening = parseFloat(plotParams.reddening as any);
    } else {
      this.plotParams = plotParams;
    }
    this.storageService.setPlotParams(plotParams);
    this.plotParamsSubject.next(this.plotParams);
  }

  public getPlotConfigs() {
    return this.plotConfigs;
  }

  public setPlotConfigs(plotConfigs: PlotConfig[]) {
    this.plotConfigs = plotConfigs;
    this.storageService.setPlotConfigs(plotConfigs);
    this.plotConfigSubject.next(this.plotConfigs);
  }

  public addPlotConfigs(plotConfig: PlotConfig) {
    this.plotConfigs.push(plotConfig);
    this.storageService.setPlotConfigs(this.plotConfigs);
    this.addPlotConfigSubject.next(this.plotConfigs);
    this.plotConfigSubject.next(this.plotConfigs);
  }

  public updatePlotFraming(plotFraming: PlotFraming, index: number) {
    this.plotConfigs[index].plotFraming = plotFraming;
    this.storageService.setPlotConfigs(this.plotConfigs);
  }

  public resetDistance() {
    const distance = this.service.getFsrParams().distance
    if (distance) {
      this.plotParams.distance = parseFloat(((distance.max + distance.min) / 2).toFixed(1));
    } else {
      this.plotParams.distance = 0.1;
    }
  }
}
