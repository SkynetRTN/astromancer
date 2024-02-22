import {Injectable} from '@angular/core';
import {ClusterMWSC, ClusterStorageObject, fsrHistogramBin, StarCounts} from "./cluster-storage.service.util";
import {JobStorageObject} from "../../../shared/job/job";
import {FsrParameters} from "../FSR/fsr.util";
import {IsochroneParams, PlotConfig, PlotParams} from "../cluster.util";

@Injectable()
export class ClusterStorageService {
  storageObject!: ClusterStorageObject;
  key: string = 'cluster-storage';

  constructor() {
    const stored: ClusterStorageObject = JSON.parse(localStorage.getItem(this.key)!);
    if (stored !== null) {
      this.storageObject = stored;
    } else {
      this.init();
    }
    // console.log(this.storageObject);
  }

  public save() {
    localStorage.setItem(this.key, JSON.stringify(this.storageObject));
  }

  public setName(name: string) {
    this.storageObject.name = name;
    this.save();
  }

  public getName() {
    return this.storageObject.name ? this.storageObject.name : '';
  }

  public getRecentSearches() {
    return this.storageObject.dataSource.recentSearches;
  }

  public setRecentSearches(recentSearches: ClusterStorageObject['dataSource']['recentSearches']) {
    this.storageObject.dataSource.recentSearches = recentSearches;
    this.save();
  }

  public setJob(job: JobStorageObject) {
    this.storageObject.dataSource.dataJob = job;
    this.save();
  }

  public getJob() {
    return this.storageObject.dataSource.dataJob;
  }

  public resetDataSource() {
    this.init();
  }

  public getDataSource() {
    return this.storageObject.dataSource;
  }

  public getTabIndex() {
    return this.storageObject.step;
  }

  public setTabIndex(index: number) {
    this.storageObject.step = index;
    this.save();
  }

  public setFsrParams(params: FsrParameters) {
    this.storageObject.fsrValues.parameters = params;
    this.save();
  }

  public getFsrParams() {
    return this.storageObject.fsrValues.parameters;
  }

  public setFsrFraming(params: FsrParameters) {
    this.storageObject.fsrValues.framing = params;
    this.save();
  }

  public getFsrFraming() {
    return this.storageObject.fsrValues.framing;
  }

  public setFsrBins(bins: fsrHistogramBin) {
    this.storageObject.fsrValues.bin = bins;
    this.save();
  }

  public getFsrBins() {
    return this.storageObject.fsrValues.bin;
  }

  public setCluster(cluster: ClusterMWSC) {
    this.storageObject.dataSource.cluster = cluster;
    this.save();
  }

  public getCluster() {
    return this.storageObject.dataSource.cluster;
  }

  public setStarCounts(starCounts: StarCounts | null) {
    this.storageObject.dataSource.starCounts = starCounts;
    this.save();
  }

  public getStarCounts(): StarCounts | null {
    return this.storageObject.dataSource.starCounts;
  }

  public setPlotConfigs(plotConfigs: PlotConfig[]) {
    this.storageObject.isochrone.plotConfigs = plotConfigs;
    this.save();
  }

  public getPlotConfigs(): PlotConfig[] {
    return this.storageObject.isochrone.plotConfigs;
  }

  public setPlotParams(plotParams: PlotParams) {
    this.storageObject.isochrone.plotParams = plotParams;
    this.save();
  }

  public getPlotParams(): PlotParams {
    return this.storageObject.isochrone.plotParams;
  }

  public setIsochroneParams(isochroneParams: IsochroneParams) {
    this.storageObject.isochrone.isochroneParams = isochroneParams;
    this.save();
  }

  public getIsochroneParams(): IsochroneParams {
    return this.storageObject.isochrone.isochroneParams;
  }

  public setMaxMagError(maxMagError: number) {
    this.storageObject.isochrone.maxMagError = maxMagError;
    this.save();
  }

  public getMaxMagError(): number {
    return this.storageObject.isochrone.maxMagError;
  }


  private init() {
    this.storageObject = {
      step: 0,
      name: '',
      dataSource: {
        recentSearches: this.storageObject?.dataSource?.recentSearches ?? [],
        dataJob: null,
        cluster: null,
        starCounts: null,
      },
      isochrone: {
        plotConfigs: [],
        plotParams: {
          distance: 0.1,
          reddening: 0,
        },
        isochroneParams: {
          age: 6.60,
          metallicity: -2.2,
        },
        maxMagError: 1,
      },
      fsrValues: {
        parameters: {
          distance: null,
          pm_ra: null,
          pm_dec: null,
        },
        framing: {
          distance: null,
          pm_ra: null,
          pm_dec: null,
        },
        bin: {
          distance: null,
          pm_ra: null,
          pm_dec: null,
        }
      }
    };
    this.save();
  }
}
