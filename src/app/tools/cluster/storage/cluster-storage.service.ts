import {Injectable} from '@angular/core';
import {ClusterStorageObject, fsrHistogramBin} from "./cluster-storage.service.util";
import {JobStorageObject} from "../../../shared/job/job";
import {Source} from "../cluster.util";
import {FsrParameters} from "../FSR/fsr.util";

@Injectable()
export class ClusterStorageService {
  storageObject: ClusterStorageObject;
  key: string = 'cluster-storage';

  constructor() {
    const stored: ClusterStorageObject = JSON.parse(localStorage.getItem(this.key)!);
    if (stored) {
      this.storageObject = stored;
    } else {
      this.storageObject = this.init();
    }
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

  public getHasFSR() {
    return this.storageObject.hasFSR;
  }

  public setHasFSR(hasFSR: boolean) {
    this.storageObject.hasFSR = hasFSR;
    this.save();
  }

  public setFSRJob(job: JobStorageObject) {
    this.storageObject.dataSource.FSRJob = job;
    this.storageObject.dataSource.lookUpJob = null;
    this.save();
  }

  public setLookUpJob(job: JobStorageObject) {
    this.storageObject.dataSource.lookUpJob = job;
    this.storageObject.dataSource.FSRJob = null;
    this.save();
  }

  public clearJobs() {
    this.storageObject.dataSource.lookUpJob = null;
    this.storageObject.dataSource.FSRJob = null;
    this.save();
  }

  public getSources(): Source[] {
    return this.storageObject.sources;
  }

  public setSources(sources: Source[]) {
    this.storageObject.sources = sources;
    this.save();
  }

  public resetDataSource() {
    this.init();
    this.save();
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


  private init(): ClusterStorageObject {
    return {
      step: 0,
      name: '',
      sources: [],
      hasFSR: false,
      dataSource: {
        recentSearches: [],
        FSRJob: null,
        lookUpJob: null
      },
      fsrValues: {
        parameters: {
          distance: null,
          pmra: null,
          pmdec: null,
        },
        framing: {
          distance: null,
          pmra: null,
          pmdec: null,
        },
        bin: {
          distance: null,
          pmra: null,
          pmdec: null,
        }
      }
    };
  }
}
