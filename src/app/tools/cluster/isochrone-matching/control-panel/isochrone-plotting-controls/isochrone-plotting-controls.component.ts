import {Component} from '@angular/core';
import {ClusterService} from "../../../cluster.service";
import {ClusterIsochroneService} from "../../cluster-isochrone.service";
import {InputSliderValue} from "../../../../shared/interface/input-slider/input-slider.component";

@Component({
    selector: 'app-isochrone-plotting-controls',
    templateUrl: './isochrone-plotting-controls.component.html',
    styleUrls: ['./isochrone-plotting-controls.component.scss']
})
export class IsochronePlottingControlsComponent {
    defaultDistance: number = 0.1;
    distance: number = this.defaultDistance;
    age: number;
    metallicity: number;
    reddening: number;
    maxMagError: number;

    constructor(private service: ClusterService,
                private isochroneService: ClusterIsochroneService) {
        this.updateDistance();
        this.service.fsrParams$.subscribe(() => {
            this.updateDistance();
        });
        const isochroneParams = this.isochroneService.getIsochroneParams();
        this.age = isochroneParams.age;
        this.metallicity = isochroneParams.metallicity;
        this.reddening = this.isochroneService.getPlotParams().reddening;
        this.maxMagError = this.isochroneService.getMaxMagError();
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
        this.isochroneService.setMaxMagError(this.maxMagError);
    }

    private updateDistance() {
        const distance = this.service.getFsrParams().distance
        if (distance) {
            this.defaultDistance = parseFloat(((distance.max + distance.min) / 2).toFixed(1));
        } else {
            this.defaultDistance = 0.1;
        }
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
