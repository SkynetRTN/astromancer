import {Component} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {FetchPopupComponent} from "../fetch-popup/fetch-popup.component";
import * as Highcharts from "highcharts";
import {ClusterService} from "../../cluster.service";
import {ClusterDataService} from "../../cluster-data.service";
import {combineLatestWith, take} from "rxjs";

@Component({
    selector: 'app-archive-fetching-graphics',
    templateUrl: './archive-fetching-graphics.component.html',
    styleUrls: ['./archive-fetching-graphics.component.scss', '../../../shared/interface/tools.scss']
})
export class ArchiveFetchingGraphicsComponent {
    Highcharts: typeof Highcharts = Highcharts;
    updateFlag: boolean = true;
    chartConstructor: any = "chart";
    chartObject!: Highcharts.Chart;

    chartOptions: Highcharts.Options = {
        chart: {
            type: 'column',
            animation: {duration: 500},
        },
        title: {
            text: undefined,
        },
        plotOptions: {
            column: {
                stacking: 'normal',
            },
        },
        legend: {
            reversed: true,
        },
        tooltip: {
            format: '<b>{key}</b><br/>{series.name}: {y}<br/>' +
                'Total: {point.stackTotal}'
        },
        xAxis: {
            categories: ['User', 'GAIA'],
        },
        series: [
            {
                name: 'Unused Catalog Stars',
                type: 'column',
                data: [0, 1100],
                colorIndex: 2,
            },
            {
                name: 'Field Stars',
                type: 'column',
                data: [200, 400],
                colorIndex: 1,
            },
            {
                name: 'Cluster Stars',
                type: 'column',
                data: [300, 700],
                colorIndex: 0,
            },
        ],
    }

    constructor(
        private service: ClusterService,
        private dataService: ClusterDataService,
        private matDialog: MatDialog) {
        this.dataService.sources$.pipe(take(1)).subscribe(data => {
            this.refreshChart();
        });
        this.service.tabIndex$.subscribe(index => {
            if (index === 2) {
                this.refreshChart();
            }
        });
    }

    refreshChart() {
        const axisLabels: string[] = [];
        const unusedCounts: number[] = [];
        const fieldCounts: number[] = [];
        const clusterCounts: number[] = [];
        const starCounts = this.dataService.getInterfaceStarCounts();
        if (Object.keys(starCounts).includes('user')) {
            axisLabels.push('User');
            unusedCounts.push(0);
            fieldCounts.push(this.dataService.getInterfaceStarCounts().user.field_stars);
            clusterCounts.push(this.dataService.getInterfaceStarCounts().user.cluster_stars);
        }
        if (Object.keys(starCounts).includes('GAIA')) {
            axisLabels.push('GAIA');
            unusedCounts.push(0);
            fieldCounts.push(this.dataService.getInterfaceStarCounts().GAIA.field_stars);
            clusterCounts.push(this.dataService.getInterfaceStarCounts().GAIA.cluster_stars);
        }
        if (Object.keys(starCounts).includes('APASS')) {
            axisLabels.push('APASS');
            unusedCounts.push(this.dataService.getInterfaceStarCounts().APASS.unused_stars);
            fieldCounts.push(this.dataService.getInterfaceStarCounts().APASS.field_stars);
            clusterCounts.push(this.dataService.getInterfaceStarCounts().APASS.cluster_stars);
        }
        if (Object.keys(starCounts).includes('TWO_MASS')) {
            axisLabels.push('2MASS');
            unusedCounts.push(this.dataService.getInterfaceStarCounts().TWO_MASS.unused_stars);
            fieldCounts.push(this.dataService.getInterfaceStarCounts().TWO_MASS.field_stars);
            clusterCounts.push(this.dataService.getInterfaceStarCounts().TWO_MASS.cluster_stars);
        }
        if (Object.keys(starCounts).includes('WISE')) {
            axisLabels.push('WISE');
            unusedCounts.push(this.dataService.getInterfaceStarCounts().WISE.unused_stars);
            fieldCounts.push(this.dataService.getInterfaceStarCounts().WISE.field_stars);
            clusterCounts.push(this.dataService.getInterfaceStarCounts().WISE.cluster_stars);
        }
        this.chartObject.series[0].setData(unusedCounts);
        this.chartObject.series[1].setData(fieldCounts);
        this.chartObject.series[2].setData(clusterCounts);
        this.chartObject.xAxis[0].update({categories: axisLabels});
        this.chartObject.redraw();
    }

    chartInitialized($event: Highcharts.Chart) {
        this.chartObject = $event;
    }

    toFiledStarRemoval() {
        this.service.setTabIndex(1);
    }

    toIsochroneMatching() {
        this.service.setTabIndex(3);
    }

    launchArchiveFetching() {
        this.matDialog.open(FetchPopupComponent, {
            width: '720px',
            disableClose: true,
        });
        this.matDialog.afterAllClosed.pipe(
            take(1),
            combineLatestWith(this.dataService.sources$)
        ).subscribe(
            () => {
                this.refreshChart();
            });
    }
}

interface StarCountByType {
    cluster: number;
    field: number;
    unused: number;
}
