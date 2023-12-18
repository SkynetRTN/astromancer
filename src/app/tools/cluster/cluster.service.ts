import {Injectable} from '@angular/core';
import {ClusterStorageService} from "./storage/cluster-storage.service";

@Injectable()
export class ClusterService {
  private clusterName: string = '';

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

}
