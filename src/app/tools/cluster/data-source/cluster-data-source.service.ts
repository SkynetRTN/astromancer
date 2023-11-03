import {Injectable} from '@angular/core';
import {FormControl} from "@angular/forms";
import {MyFileParser} from "../../shared/data/FileParser/FileParser";
import {FileType} from "../../shared/data/FileParser/FileParser.util";
import {Subject} from "rxjs";
import {
  ClusterDataSourceStepper,
  ClusterDataSourceStepperImpl,
  ClusterLookUpData,
  ClusterRawData
} from "./cluster-data-source.service.util";
import {FILTER, Source} from "../cluster.util";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";

@Injectable()
export class ClusterDataSourceService implements ClusterDataSourceStepper {
  private rawDataSubject: Subject<ClusterRawData[]> = new Subject<ClusterRawData[]>();
  public rawData$ = this.rawDataSubject.asObservable();
  private lookUpDataSubject: Subject<ClusterLookUpData> = new Subject<ClusterLookUpData>();
  public lookUpData$ = this.lookUpDataSubject.asObservable();
  private readonly dataSourceStepperImpl: ClusterDataSourceStepper = new ClusterDataSourceStepperImpl();
  private readonly fileParser: MyFileParser = new MyFileParser(FileType.CSV,
    ['id', 'filter', 'calibrated_mag', 'mag_error', 'ra_hours', 'dec_degs'])
  private rawData: ClusterRawData[] = [];
  private sources: Source[] = [];
  private filters: FILTER[] = [];

  constructor(private http: HttpClient) {
  }

  init() {
    this.rawData = [];
    this.sources = [];
    this.filters = [];
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

  getSources(): Source[] {
    return this.sources;
  }

  getFilters(): FILTER[] {
    return this.filters;
  }

  public lookUpCluster(query: string): void {
    this.http.get(`${environment.apiUrl}/cluster/lookup`, {params: {'name': query}}).subscribe(
      (response: any) => {
        this.lookUpDataSubject.next({
          name: query,
          ra: parseFloat(response['ra']),
          dec: parseFloat(response['dec']),
          radius: parseFloat(response['radius'])
        });
      }
    )
  }

  private processData(): void {
    const sortedData = this.rawData.sort((a, b) => {
      return a.id.localeCompare(b.id);
    });
    const processedData: Source[] = [];
    const filters: FILTER[] = [];
    let currentId = sortedData[0].id;
    let currentStar: Source = {
      astrometry: {
        id: currentId,
        ra: 0,
        dec: 0
      },
      photometries: [],
      fsr: null,
    }
    let raSum: number = 0;
    let decSum: number = 0;
    for (let i = 0; i < sortedData.length; i++) {
      if (sortedData[i].id !== currentId) {
        currentStar.astrometry.ra = raSum / currentStar.photometries.length;
        currentStar.astrometry.dec = decSum / currentStar.photometries.length;
        processedData.push(currentStar);
        currentId = sortedData[i].id;
        raSum = parseFloat(sortedData[i].ra_hours) * 15;
        decSum = parseFloat(sortedData[i].dec_degs);
        currentStar = {
          astrometry: {
            id: currentId,
            ra: 0,
            dec: 0
          },
          photometries: [],
          fsr: null,
        }
      } else {
        raSum += parseFloat(sortedData[i].ra_hours) * 15;
        decSum += parseFloat(sortedData[i].dec_degs);
      }
      currentStar.photometries.push({
        filter: sortedData[i].filter as any as FILTER,
        mag: parseFloat(sortedData[i].calibrated_mag),
        mag_error: parseFloat(sortedData[i].mag_error)
      });
      if (!filters.includes(sortedData[i].filter as any as FILTER)) {
        filters.push(sortedData[i].filter as any as FILTER);
      }
    }
    currentStar.astrometry.ra = raSum / currentStar.photometries.length;
    currentStar.astrometry.dec = decSum / currentStar.photometries.length;
    processedData.push(currentStar);
    this.sources = processedData;
    this.filters = filters;
  }

  private setRawData(rawData: ClusterRawData[]): void {
    this.rawData = rawData.filter((entry) => entry.id !== undefined);
    this.processData();
    this.rawDataSubject.next(this.rawData);
  }
}
