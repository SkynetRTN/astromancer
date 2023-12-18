import {Injectable} from '@angular/core';
import {ClusterStorageService} from "./storage/cluster-storage.service";
import {Subject} from "rxjs";

@Injectable()
export class ClusterService {
  private clusterName: string = '';
  private tabIndexSubject: Subject<number> = new Subject<number>();
  tabIndex$ = this.tabIndexSubject.asObservable();

  constructor(private storageService: ClusterStorageService) {
    this.clusterName = this.storageService.getName();
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
  }

}
