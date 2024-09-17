import {Injectable} from '@angular/core';
import {RadioSearchStorageObject} from "./radiosearch-storage.service.util";
import { Source } from './radiosearch-storage.service.util';
import {JobStorageObject} from "../../../shared/job/job";

@Injectable()
export class RadioSearchStorageService {
  storageObject!: RadioSearchStorageObject;
  key: string = 'radio-search-storage';

  constructor() {
    const stored: RadioSearchStorageObject = JSON.parse(localStorage.getItem(this.key)!);
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

  public setSources(sources: Source[]) {
    this.storageObject.dataSource.sources = sources;
    this.save();
  }

  public getSources(): Source[] {
    return this.storageObject.dataSource.sources;
  }

  public setJob(job: JobStorageObject) {
    this.storageObject.dataSource.dataJob = job;
    this.save();
  }

  public getJob() {
    return this.storageObject.dataSource.dataJob;
  }

  private init() {
    this.storageObject = {
      dataSource: {
        dataJob: null,
        sources: []  // Initialize an empty array for sources
      }
    };
    this.save();
  }
}
