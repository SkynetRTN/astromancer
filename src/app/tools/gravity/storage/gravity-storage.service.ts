import {Injectable} from '@angular/core';
import {GravityStorageObject} from "./gravity-storage.service.util";
import {JobStorageObject} from "../../../shared/job/job";
import { GravityInterfaceImpl } from '../param-matching/gravity.service.util';

@Injectable()
export class GravityStorageService {
  storageObject!: GravityStorageObject;
  key: string = 'gravity-storage';

  constructor() {
    const stored: GravityStorageObject = JSON.parse(localStorage.getItem(this.key)!);
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

  public setJob(job: JobStorageObject) {
    this.storageObject.dataJob = job;
    this.save();
  }

  public getJob() {
    return this.storageObject.dataJob;
  }

  public resetDataSource() {
    this.init();
  }

  private init() {
    this.storageObject = {
      name: '',
      dataJob: null,
      //Maybe just make paramvalues nullable and handle this elsewhere.
      paramValues: GravityInterfaceImpl.getDefaultStorageObject()
    }
    this.save();
  }
}
