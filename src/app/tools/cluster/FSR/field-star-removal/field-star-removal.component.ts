import {Component} from '@angular/core';
import {range} from "../histogram-slider-input/histogram-slider-input.component";
import {ClusterDataService} from "../../cluster-data.service";
import {Subject} from "rxjs";

@Component({
  selector: 'app-field-star-removal',
  templateUrl: './field-star-removal.component.html',
  styleUrls: ['./field-star-removal.component.scss', '../../../shared/interface/tools.scss']
})
export class FieldStarRemovalComponent {
  distanceParams: FsrParameters = {
    bin: 0,
    range: {min: 0, max: 0},
    histogramRange: {min: 0, max: 0}
  }

  pmraParams: FsrParameters = {
    bin: 0,
    range: {min: 0, max: 0},
    histogramRange: {min: 0, max: 0}
  }

  pmdecParams: FsrParameters = {
    bin: 0,
    range: {min: 0, max: 0},
    histogramRange: {min: 0, max: 0}
  }

  $pmra: Subject<number[]> = new Subject<number[]>;
  pmraInitData: number[] = this.dataService.getPmra();
  $pmdec: Subject<number[]> = new Subject<number[]>;
  pmdecInitData: number[] = this.dataService.getPmdec();
  $distance: Subject<number[]> = new Subject<number[]>;
  distanceInitData: number[] = this.dataService.getDistance();

  constructor(public dataService: ClusterDataService) {
    this.dataService.data$.subscribe(
      () => {
        this.$distance.next(this.dataService.getDistance());
        this.$pmra.next(this.dataService.getPmra());
        this.$pmdec.next(this.dataService.getPmdec());
      });
  }

  distanceRangeHandler($event: range) {
    this.distanceParams.range = $event;
  }

  distanceBinsHandler($event: number) {
    this.distanceParams.bin = $event;
  }

  distanceHistogramRangeHandler($event: range) {
    this.distanceParams.histogramRange = $event;
  }

  pmraRangeHandler($event: range) {
    this.pmraParams.range = $event;
  }

  pmraBinsHandler($event: number) {
    this.pmraParams.bin = $event;
  }

  pmraHistogramRangeHandler($event: range) {
    this.pmraParams.histogramRange = $event;
  }

  pmdecRangeHandler($event: range) {
    this.pmdecParams.range = $event;
  }

  pmdecBinsHandler($event: number) {
    this.pmdecParams.bin = $event;
  }

  pmdecHistogramRangeHandler($event: range) {
    this.pmdecParams.histogramRange = $event;
  }
}

export interface FsrParameters {
  bin: number,
  range: range,
  histogramRange: range
}
