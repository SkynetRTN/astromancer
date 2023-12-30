import {Component} from '@angular/core';
import {ClusterPlotType, PlotConfig} from "../../../cluster.util";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {ClusterIsochroneService} from "../../cluster-isochrone.service";

@Component({
    selector: 'app-plot-lists',
    templateUrl: './plot-lists.component.html',
    styleUrls: ['./plot-lists.component.scss'],
})
export class PlotListsComponent {
    plotTypes = Object.values(ClusterPlotType);
    plotConfigs: PlotConfig[] = this.isochroneService.getPlotConfigs();

    constructor(private isochroneService: ClusterIsochroneService) {
        this.isochroneService.plotConfig$.subscribe(
            (plotConfigs) => {
                this.plotConfigs = plotConfigs;
            });
    }

    drop(event: CdkDragDrop<string[]>) {
        moveItemInArray(this.plotConfigs, event.previousIndex, event.currentIndex);
        this.isochroneService.setPlotConfigs(this.plotConfigs);
    }

    typeToggle(type: ClusterPlotType, index: number) {
        this.plotConfigs[index].plotType = type;
        this.isochroneService.setPlotConfigs(this.plotConfigs);
    }

    remove(index: number) {
        this.plotConfigs.splice(index, 1);
        this.isochroneService.setPlotConfigs(this.plotConfigs);
    }


}
