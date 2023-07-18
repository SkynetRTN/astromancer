import {Injectable} from '@angular/core';
import {ClusterDataSourceService} from "./data-source/cluster-data-source.service";
import {ClusterDataDict, gaiaMatchQueryDataDict, gaiaMatchQueryRange, haversine} from "./cluster.util";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Subject} from "rxjs";

@Injectable()
export class ClusterDataService {
  private dataDict: ClusterDataDict[] = [];
  private dataSubject = new Subject<ClusterDataDict[]>();
  public data$ = this.dataSubject.asObservable();

  constructor(
    private http: HttpClient,
    private dataSourceService: ClusterDataSourceService) {
  }

  matchWithGaia() {
    this.dataDict = this.dataSourceService.getDataDict();
    this.http.post(
      `${environment.apiUrl}/gaia`,
      JSON.stringify({'data': this.getGaiaQueryData(), 'range': this.getGaiaQueryRange()}),
      {headers: {'content-type': 'application/json'}}).subscribe(
      (data: any) => {
        const sortedGaiaData = data.sort((a: any, b: any) => {
          return a.id.localeCompare(b.id);
        });
        const sortedDataDict = this.dataDict.sort((a, b) => {
          return a.id.localeCompare(b.id);
        });
        let i = 0;
        let j = 0;
        while (i < this.dataDict.length && j < sortedGaiaData.length) {
          if (this.dataDict[i].id === sortedGaiaData[j].id) {
            this.dataDict[i].distance = sortedGaiaData[j]['range'];
            this.dataDict[i].pmra = sortedGaiaData[j]['pm']['ra'];
            this.dataDict[i].pmdec = sortedGaiaData[j]['pm']['dec'];
            i++;
            j++;
          } else if (this.dataDict[i].id < sortedGaiaData[j].id) {
            i++;
          } else {
            j++;
          }
        }
        this.dataSubject.next(this.dataDict);
      }
    );
  }

  private getGaiaQueryData(): gaiaMatchQueryDataDict[] {
    return this.dataDict.filter((star) => {
      return star.id && star.ra && star.dec
    }).map(
      (star) => {
        return {'id': star.id, 'ra': star.ra, 'dec': star.dec}
      }
    )
  }

  private getGaiaQueryRange(): gaiaMatchQueryRange {
    const validDataDict =
      this.dataDict.filter((star) => {
        return star.ra !== undefined && star.dec !== undefined;
      });
    const sortByRa =
      (JSON.parse(JSON.stringify(validDataDict)) as ClusterDataDict[]).sort(
        (a, b) => {
          return (a.ra! < b.ra!) ? 1 : -1;
        });
    let maxRa = sortByRa[0].ra!;
    let minRa = sortByRa[sortByRa.length - 1].ra!;
    const sortByDec =
      (JSON.parse(JSON.stringify(validDataDict)) as ClusterDataDict[]).sort(
        (a, b) => {
          return (a.dec! < b.dec!) ? 1 : -1;
        });
    let maxDec = sortByDec[0].dec!;
    let minDec = sortByDec[sortByDec.length - 1].dec!;
    let deltaRa = maxRa - minRa;
    let wrap = false;
    if (deltaRa > 180) {
      wrap = true;
      for (let star of validDataDict) {
        if (star.ra! < minRa && star.ra! > 180)
          minRa = star.ra!;
        if (star.ra! > maxRa && star.ra! < 180)
          maxRa = star.ra!;
      }
      if (minRa - maxRa < 180)
        return {'ra': 0, 'dec': 90, 'r': 90 - Math.abs(minDec), 'wrap': true}
    }
    let centerRa = (minRa + maxRa) / 2;
    if (minRa - maxRa > 180)
      if (centerRa > 180)
        centerRa -= 180
      else
        centerRa += 180
    let centerDec = (maxDec + minDec) / 2
    let radius = haversine(maxDec, centerDec, maxRa, centerRa)
    return {'ra': centerRa, 'dec': centerDec, 'r': radius, 'wrap': wrap}
  }

}
