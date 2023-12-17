import {Injectable} from '@angular/core';
import {ClusterStorageObject} from "./cluster-storage.service.util";

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

  public getRecentSearches() {
    return this.storageObject.dataSource.recentSearches;
  }

  public setRecentSearches(recentSearches: ClusterStorageObject['dataSource']['recentSearches']) {
    this.storageObject.dataSource.recentSearches = recentSearches;
    this.save();
  }

  private init(): ClusterStorageObject {
    return {
      step: 0,
      name: null,
      sources: null,
      filters: null,
      dataSource: {
        recentSearches: [],
        FSRJob: null,
        lookUpJob: null
      }
    };
  }
}
