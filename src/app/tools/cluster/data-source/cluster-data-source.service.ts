import {Injectable} from '@angular/core';
import {FormControl} from "@angular/forms";
import {ClusterDataSourceStepper, ClusterDataSourceStepperImpl} from "./cluster-data-source.service.uti";
import {MyFileParser} from "../../shared/data/FileParser/FileParser";
import {FileType} from "../../shared/data/FileParser/FileParser.util";
import {Subject} from "rxjs";
import {ClusterRawData} from "./cluster-data-source.service.util";
import {ClusterDataDict, FILTER} from "../cluster.util";

@Injectable()
export class ClusterDataSourceService implements ClusterDataSourceStepper {
  public rawData$: Subject<ClusterRawData[]> = new Subject<ClusterRawData[]>();
  private readonly dataSourceStepperImpl: ClusterDataSourceStepper = new ClusterDataSourceStepperImpl();
  private readonly fileParser: MyFileParser = new MyFileParser(FileType.CSV,
    ['id', 'filter', 'calibrated_mag', 'mag_error', 'ra_hours', 'dec_degs'])
  private rawData: ClusterRawData[] = [];
  private dataDict: ClusterDataDict[] = [];
  private filters: FILTER[] = [];

  constructor() {
  }

  getFormControl(): FormControl {
    return this.dataSourceStepperImpl.getFormControl();
  }

  setFormControlStatus(isValid: boolean): void {
    this.dataSourceStepperImpl.setFormControlStatus(isValid);
  }

  onFileUpload(file: File): void {
    this.fileParser.data$.subscribe(
      data => {
        this.setRawData(data);
      });
    this.fileParser.error$.subscribe(
      error => {
        alert("File Upload Error: " + error);
      });
    this.fileParser.readFile(file, true);
  }

  private setRawData(rawData: ClusterRawData[]): void {
    this.rawData = rawData;
    this.processData();
    this.rawData$.next(this.rawData);
  }

  processData(): void {
    const sortedData = this.rawData.sort((a, b) => {
      return a.id.localeCompare(b.id);
    });
    const processedData: ClusterDataDict[] = [];
    const filters: FILTER[] = [];
    let currentId = sortedData[0].id;
    let currentStar: ClusterDataDict = {
      id: currentId,
      ra: undefined,
      dec: undefined,
      photometries: []
    }
    for (let i = 0; i < sortedData.length; i++) {
      if (sortedData[i].id !== currentId) {
        let raSum = 0;
        let decSum = 0;
        currentStar.photometries.map(
          photometry => {
            raSum += photometry.ra;
            decSum += photometry.dec;
          });
        currentStar.ra = raSum / currentStar.photometries.length;
        currentStar.dec = decSum / currentStar.photometries.length;
        processedData.push(currentStar);
        currentId = sortedData[i].id;
        currentStar = {
          id: currentId,
          ra: undefined,
          dec: undefined,
          photometries: []
        }
      }
      currentStar.photometries.push({
        filter: sortedData[i].filter as any as FILTER,
        ra: parseFloat(sortedData[i].ra_hours) * 15,
        dec: parseFloat(sortedData[i].dec_degs),
        mag: parseFloat(sortedData[i].calibrated_mag),
        mag_error: parseFloat(sortedData[i].mag_error)
      });
      if (!filters.includes(sortedData[i].filter as any as FILTER)) {
        filters.push(sortedData[i].filter as any as FILTER);
      }
    }
    this.dataDict = processedData;
    this.filters = filters;
  }

  getDataDict(): ClusterDataDict[] {
    return this.dataDict;
  }

  getFilters(): FILTER[] {
    return this.filters;
  }
}
