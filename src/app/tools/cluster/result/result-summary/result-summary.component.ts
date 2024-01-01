import {Component} from '@angular/core';
import {ClusterService} from "../../cluster.service";
import {ClusterDataService} from "../../cluster-data.service";
import {ClusterIsochroneService} from "../../isochrone-matching/cluster-isochrone.service";
import {getHalfLightRadius, getPhysicalRadius, getPmra} from "../result.utils";
import {d2DMS, d2HMS} from "../../../shared/data/utils";

@Component({
    selector: 'app-result-summary',
    templateUrl: './result-summary.component.html',
    styleUrls: ['./result-summary.component.scss']
})
export class ResultSummaryComponent {
    angularRadius!: number;
    angularRadiusDMS: string = "";
    physicalRadius!: number;
    ra: number = 0;
    dec: number = 0;
    raHMS: string = "";
    decDMS: string = "";
    l: number = this.dataService.getCluster()?.galactic_latitude!;
    lDMS: string = "";
    b: number = this.dataService.getCluster()?.galactic_longitude!;
    bDMS: string = "";
    distance!: number;
    age!: number;
    metallicity!: number;
    reddening!: number;
    pmra!: number;
    pmdec!: number;

    constructor(public service: ClusterService,
                public dataService: ClusterDataService,
                public isochroneService: ClusterIsochroneService) {
        this.dataService.sources$.subscribe(() => {
            const sources = this.dataService.getSources(true);
            this.angularRadius = getHalfLightRadius(sources,
                this.dataService.getClusterRa()!, this.dataService.getClusterDec()!);
            const angularRadiusDMSarr = d2DMS(this.angularRadius);
            this.angularRadiusDMS =
                `${angularRadiusDMSarr[0]}° ${angularRadiusDMSarr[1]}' ${angularRadiusDMSarr[2].toFixed(1)}"`
            this.ra = this.dataService.getClusterRa()!;
            const raHMSarr = d2HMS(this.ra);
            this.raHMS = `${raHMSarr[0]}h ${raHMSarr[1]}m ${raHMSarr[2].toFixed(1)}s`
            this.dec = this.dataService.getClusterDec()!;
            const decDMSarr = d2DMS(this.dec);
            this.decDMS = `${decDMSarr[0]}° ${decDMSarr[1]}' ${decDMSarr[2].toFixed(1)}"`
            this.l = this.dataService.getCluster()?.galactic_latitude!;
            const lDMSarr = d2DMS(this.l);
            this.lDMS = `${lDMSarr[0]}° ${lDMSarr[1]}' ${lDMSarr[2].toFixed(1)}"`
            this.b = this.dataService.getCluster()?.galactic_longitude!;
            const bDMSarr = d2DMS(this.b);
            this.bDMS = `${bDMSarr[0]}° ${bDMSarr[1]}' ${bDMSarr[2].toFixed(1)}"`
            const plotParams = this.isochroneService.getPlotParams();
            const isochroneParams = this.isochroneService.getIsochroneParams();
            this.distance = plotParams.distance;
            this.reddening = plotParams.reddening;
            this.age = isochroneParams.age;
            this.metallicity = isochroneParams.metallicity;
            this.physicalRadius = getPhysicalRadius(this.distance, this.angularRadius);
            this.pmra = getPmra(this.dataService.getPmra());
            this.pmdec = getPmra(this.dataService.getPmdec());
        });
    }
}
