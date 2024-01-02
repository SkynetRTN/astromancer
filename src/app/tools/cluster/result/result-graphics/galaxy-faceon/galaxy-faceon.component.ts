import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ClusterDataService} from "../../../cluster-data.service";
import {ClusterIsochroneService} from "../../../isochrone-matching/cluster-isochrone.service";
import {rad} from "../../../../shared/data/utils";
import {delay} from "rxjs";
import {ClusterService} from "../../../cluster.service";
import {drawStar} from "../../result.utils";

@Component({
    selector: 'app-galaxy-faceon',
    templateUrl: './galaxy-faceon.component.html',
    styleUrls: ['./galaxy-faceon.component.scss']
})
export class GalaxyFaceonComponent implements OnInit {

    @ViewChild('canvas') canvas!: ElementRef;
    @ViewChild('galaxy') galaxy!: ElementRef;
    name: string = '';

    constructor(private service: ClusterService,
                private dataService: ClusterDataService,
                private isochroneService: ClusterIsochroneService) {
        this.name = this.service.getClusterName();
    }

    ngOnInit(): void {
        this.dataService.sources$.pipe(
            delay(300)
        ).subscribe(() => {
            const canvas = this.canvas.nativeElement;
            canvas.width = 1000;
            canvas.height = 1000;
            const ctx = canvas.getContext('2d');
            const img = this.galaxy.nativeElement;
            const ratio: number = canvas.width / img.width;
            ctx.drawImage(this.galaxy.nativeElement, 0, 0, img.width, img.height,
                0, 0, canvas.width, canvas.height);

            const center_x: number = 500;
            const center_y: number = 720;

            drawStar(ctx, 'orange', 'yellow', center_x, center_y, 5, 10, 5);

            const l: number = rad(this.dataService.getGalacticLongitude()!);
            const b: number = rad(this.dataService.getGalacticLatitude()!);
            const distance: number = this.isochroneService.getPlotParams().distance;
            const d: number = distance * Math.cos(b) * 32; // one pixel is 32 kpc
            const delta_x: number = d * Math.sin(l);
            const delta_y: number = -d * Math.cos(l);
            drawStar(ctx, 'red', 'red', center_x + delta_x, center_y + delta_y,
                25, 15, 10)
        });
    }

}

