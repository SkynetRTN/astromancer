import {Injectable} from '@angular/core';
import {FormControl} from "@angular/forms";
import {ClusterDataSourceStepper, ClusterDataSourceStepperImpl} from "./cluster-data-source.service.uti";
import {MyFileParser} from "../../shared/data/FileParser/FileParser";
import {FileType} from "../../shared/data/FileParser/FileParser.util";
import {Subject} from "rxjs";
import {ClusterRawData} from "./cluster-data-source.service.util";

@Injectable()
export class ClusterDataSourceService implements ClusterDataSourceStepper {
  public rawData$: Subject<ClusterRawData[]> = new Subject<ClusterRawData[]>();
  private readonly dataSourceStepperImpl: ClusterDataSourceStepper = new ClusterDataSourceStepperImpl();
  private readonly fileParser: MyFileParser = new MyFileParser(FileType.CSV,
    ['id', 'filter', 'calibrated_mag', 'mag_error', 'ra_hours', 'dec_degs'])
  private rawData: ClusterRawData[] = [];

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
        console.log(data);
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
    this.rawData$.next(this.rawData);
  }
}
