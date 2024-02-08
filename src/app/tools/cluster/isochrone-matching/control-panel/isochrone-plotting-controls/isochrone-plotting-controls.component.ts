import {Component} from '@angular/core';
import {ClusterService} from "../../../cluster.service";
import {ClusterIsochroneService} from "../../cluster-isochrone.service";
import {InputSliderValue} from "../../../../shared/interface/input-slider/input-slider.component";
import {Subject} from "rxjs";

@Component({
  selector: 'app-isochrone-plotting-controls',
  templateUrl: './isochrone-plotting-controls.component.html',
  styleUrls: ['./isochrone-plotting-controls.component.scss']
})
export class IsochronePlottingControlsComponent {
  distance!: number;
  distance$: Subject<number> = new Subject<number>();
  age!: number;
  metallicity!: number;
  reddening!: number;
  maxMagError!: number;

  constructor(private service: ClusterService,
              private isochroneService: ClusterIsochroneService) {
    this.init();
    this.service.tabIndex$.subscribe(
      (index) => {
        if (index === 3) {
          this.init();
        }
      });
  }

  init() {
    // this.isochroneService.resetDistance();
    const isochroneParams = this.isochroneService.getIsochroneParams();
    this.age = isochroneParams.age ?? 6.60;
    this.metallicity = isochroneParams.metallicity ?? -2.2;
    const plotParams = this.isochroneService.getPlotParams();
    this.reddening = plotParams.reddening ?? 0;
    this.distance = plotParams.distance ?? 0.1;
    this.maxMagError = this.isochroneService.getMaxMagError() ?? 0;
    this.updatePlotParams();
    this.updateIsochroneParams();
    this.distance$.next(this.distance);
  }

  onDistanceChange($event: InputSliderValue) {
    this.distance = $event.value;
    this.updatePlotParams();
  }

  onAgeChange($event: InputSliderValue) {
    this.age = $event.value;
    this.updateIsochroneParams();
  }

  onMetallicityChange($event: InputSliderValue) {
    this.metallicity = $event.value;
    this.updateIsochroneParams();
  }

  onReddeningChange($event: InputSliderValue) {
    this.reddening = $event.value;
    this.updatePlotParams();
  }

  onMaxMagErrorChange($event: InputSliderValue) {
    this.maxMagError = $event.value;
    console.log(this.maxMagError);
    this.isochroneService.setMaxMagError(this.maxMagError);
  }

  private updatePlotParams() {
    this.isochroneService.setPlotParams({
      distance: this.distance,
      reddening: this.reddening,
    });
  }

  private updateIsochroneParams() {
    this.isochroneService.setIsochroneParams({
      age: this.age,
      metallicity: this.metallicity,
    });
  }
}
