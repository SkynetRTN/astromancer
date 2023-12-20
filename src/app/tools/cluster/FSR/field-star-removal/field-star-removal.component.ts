import {Component} from '@angular/core';
import {range} from "../histogram-slider-input/histogram-slider-input.component";
import {ClusterDataService} from "../../cluster-data.service";
import {Subject} from "rxjs";
import {FsrComponents} from "../fsr.util";

@Component({
  selector: 'app-field-star-removal',
  templateUrl: './field-star-removal.component.html',
  styleUrls: ['./field-star-removal.component.scss', '../../../shared/interface/tools.scss']
})
export class FieldStarRemovalComponent {
  distanceParams: FsrComponents = {
    bin: 0,
    range: {min: 0, max: 0},
    histogramRange: {min: 0, max: 0}
  }

  pmraParams: FsrComponents = {
    bin: 0,
    range: {min: 0, max: 0},
    histogramRange: {min: 0, max: 0}
  }

  pmdecParams: FsrComponents = {
    bin: 0,
    range: {min: 0, max: 0},
    histogramRange: {min: 0, max: 0}
  }

  $pmra: Subject<{ data: number[], emit: boolean }> = new Subject<{ data: number[], emit: boolean }>;
  pmraInitData: number[] = this.dataService.getPmra();
  $pmdec: Subject<{ data: number[], emit: boolean }> = new Subject<{ data: number[], emit: boolean }>;
  pmdecInitData: number[] = this.dataService.getPmdec();
  $distance: Subject<{ data: number[], emit: boolean }> = new Subject<{ data: number[], emit: boolean }>;
  distanceInitData: number[] = this.dataService.getDistance();

  constructor(public dataService: ClusterDataService) {
    this.dataService.data$.subscribe(
      () => {
        this.$distance.next({data: this.dataService.getDistance(), emit: true});
        this.$pmra.next({data: this.dataService.getPmra(), emit: true});
        this.$pmdec.next({data: this.dataService.getPmdec(), emit: true});
      });
  }

  distanceRangeHandler($event: range) {
    this.distanceParams.range = $event;
    this.setFSRParams();
    this.$pmra.next({data: this.dataService.getPmra(), emit: false});
    this.$pmdec.next({data: this.dataService.getPmdec(), emit: false});
  }

  distanceBinsHandler($event: number) {
    this.distanceParams.bin = $event;
  }

  distanceHistogramRangeHandler($event: range) {
    this.distanceParams.histogramRange = $event;
  }

  pmraRangeHandler($event: range) {
    console.log($event);
  }

  pmraBinsHandler($event: number) {
    this.pmraParams.bin = $event;
  }

  pmraHistogramRangeHandler($event: range) {
    this.pmraParams.histogramRange = $event;
  }

  pmdecRangeHandler($event: range) {
    this.pmdecParams.range = $event;
    this.setFSRParams();
    this.$pmra.next({data: this.dataService.getPmra(), emit: false});
    this.$distance.next({data: this.dataService.getDistance(), emit: false});
  }

  pmdecBinsHandler($event: number) {
    this.pmdecParams.bin = $event;
  }

  pmdecHistogramRangeHandler($event: range) {
    this.pmdecParams.histogramRange = $event;
  }

  private setFSRParams() {
    this.dataService.setFSRCriteria({
      distance: this.distanceParams.range,
      pmra: this.pmraParams.range,
      pmdec: this.pmdecParams.range
    });
  }

  pmraInit() {
    this.$pmra.next({data: this.dataService.getPmra(), emit: true});
  }
}

