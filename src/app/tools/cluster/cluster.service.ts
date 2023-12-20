import {Injectable} from '@angular/core';
import {ClusterStorageService} from "./storage/cluster-storage.service";
import {Subject} from "rxjs";
import {FsrParameters} from "./FSR/fsr.util";
import {ClusterDataService} from "./cluster-data.service";

@Injectable()
export class ClusterService {
  private clusterName: string = '';
  private fsrParams: FsrParameters = {
    distance: null,
    pmra: null,
    pmdec: null,
  };
  private fsrFraming: FsrParameters = {
    distance: null,
    pmra: null,
    pmdec: null,
  }
  private fsrParamsSubject: Subject<FsrParameters> = new Subject<FsrParameters>();
  fsrParams$ = this.fsrParamsSubject.asObservable();
  private fsrFramingSubject: Subject<FsrParameters> = new Subject<FsrParameters>();
  fsrFraming$ = this.fsrFramingSubject.asObservable();
  private tabIndexSubject: Subject<number> = new Subject<number>();
  tabIndex$ = this.tabIndexSubject.asObservable();

  constructor(
    private dataService: ClusterDataService,
    private storageService: ClusterStorageService) {
    this.clusterName = this.storageService.getName();
    this.dataService.setFSRCriteria(this.fsrParams);
  }

  getFsrParams(): FsrParameters {
    return this.fsrParams;
  }

  setFsrParams(params: FsrParameters) {
    this.fsrParams = params;
    this.dataService.setFSRCriteria(params);
    this.fsrParamsSubject.next(params);
  }

  setFsrFraming(params: FsrParameters) {
    this.fsrFraming = params;
    this.fsrFramingSubject.next(params);
  }

  getFsrFraming(): FsrParameters {
    return this.fsrFraming;
  }

  reset() {
    this.setClusterName('');
  }

  setClusterName(name: string) {
    this.clusterName = name;
    this.storageService.setName(name);
  }

  getClusterName() {
    return this.clusterName;
  }

  setTabIndex(index: number) {
    this.tabIndexSubject.next(index);
    this.storageService.setTabIndex(index);
    this.storageService.clearJobs();
  }

}
