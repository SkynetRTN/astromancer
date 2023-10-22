import {Injectable} from '@angular/core';

@Injectable()
export class ClusterService {
  private clusterName: string = '';

  constructor() {
  }

  init() {
    this.clusterName = '';
  }

  setClusterName(name: string) {
    this.clusterName = name;
  }

  getClusterName() {
    return this.clusterName;
  }

}
