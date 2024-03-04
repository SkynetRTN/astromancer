import {Component} from '@angular/core';
import {ClusterIsochroneService} from "../../cluster-isochrone.service";
import {PlotConfig} from "../../../cluster.util";
import {combineLatestWith, delay, take} from "rxjs";
import {ClusterDataService} from "../../../cluster-data.service";

@Component({
    selector: 'app-cluster-plot-grid',
    templateUrl: './cluster-plot-grid.component.html',
    styleUrls: ['./cluster-plot-grid.component.scss']
})
export class ClusterPlotGridComponent {
    gridNumber = 0;
    plotConfigs: PlotConfig[] = [];

    constructor(private isochroneService: ClusterIsochroneService,
                private dataService: ClusterDataService) {

        this.dataService.sources$.pipe(take(1)).subscribe(() => {
            this.gridNumber = this.isochroneService.getPlotConfigs().length;
            this.plotConfigs = this.isochroneService.getPlotConfigs();
        });

        this.isochroneService.plotConfig$.pipe(
            combineLatestWith(this.dataService.clusterSources),
            delay(500)
        ).subscribe(() => {
            this.plotConfigs = this.isochroneService.getPlotConfigs();
            this.gridNumber = this.isochroneService.getPlotConfigs().length;
        });
        this.isochroneService.resetPlotConfig$.subscribe(
            (plotConfigs) => {
                this.plotConfigs = plotConfigs;
            });
    }
}
