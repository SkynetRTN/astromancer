import {AfterViewInit, Component, Input, OnChanges} from '@angular/core';
import * as Highcharts from "highcharts";
import {ClusterMWSC} from "../../../storage/cluster-storage.service.util";
import {ClusterService} from "../../../cluster.service";
import {ClusterIsochroneService} from "../../../isochrone-matching/cluster-isochrone.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-metallicity',
  templateUrl: './metallicity.component.html',
  styleUrls: ['./metallicity.component.scss', '../result-graphics/result-graphics.component.scss']
})
export class MetallicityComponent implements OnChanges, AfterViewInit {

  @Input() allClusters!: ClusterMWSC[];
  @Input() update$!: Observable<void>;

  Highcharts: typeof Highcharts = Highcharts;
  chartConstructor: any = "chart";
  chartObject!: Highcharts.Chart;

  chartOptions: Highcharts.Options = {
    chart: {
      animation: false,
      styledMode: true,
    },
    title: {
      text: 'Metallicity Among Milky Way Star Clusters'
    },
    xAxis: [{
      title: {
        text: 'Metallicity (solar)'
      },
      min: -2.3,
      max: 0.8,
    },
      {
        visible: false,
      }],
    yAxis: [{
      title: {
        text: '# Clusters in Bin'
      },
      min: 0,
    }],
    series: [
      {
        name: '#Clusters in Bin',
        type: 'histogram',
        baseSeries: 'data',
        zIndex: 0,
        colorIndex: 4,
        opacity: 0.5,
      },
      {
        id: 'data',
        type: 'scatter',
        data: [1, 2, 3, 4],
        visible: false,
        showInLegend: false,
        xAxis: 1,
      },
      {
        name: this.service.getClusterName(),
        type: 'scatter',
        data: [],
        colorIndex: 7,
        marker: {
          symbol: 'circle',
          radius: 10,
        },
      },
    ],
  }

  constructor(private service: ClusterService,
              private isochroneService: ClusterIsochroneService) {
  }

  chartInitialized($event: Highcharts.Chart) {
    this.chartObject = $event;
  }

  ngOnChanges(): void {
    if (this.chartObject === undefined)
      return;
    let metallicities: number[] = [];
    this.allClusters.forEach((cluster: ClusterMWSC) => {
      if (cluster.metallicity !== null && cluster.metallicity !== undefined
        && cluster.metallicity > -2.3 && cluster.metallicity < 0.8)
        metallicities.push(cluster.metallicity);
    });
    metallicities.sort((a, b) => a - b);
    this.chartObject.series[1].setData(metallicities);
  }

  ngAfterViewInit(): void {
    this.updateData();
    this.update$.subscribe(() => this.updateData());
  }

  updateData(): void {
    this.chartObject.series[2].setData([[this.isochroneService.getIsochroneParams().metallicity, 0]]);
  }
}
