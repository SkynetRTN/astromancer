import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ClusterComponent} from "./cluster/cluster.component";
import {RouterModule, Routes} from "@angular/router";
import {ClusterStepperComponent} from './cluster-stepper/cluster-stepper.component';
import {MatStepperModule} from "@angular/material/stepper";
import {MatButtonModule} from "@angular/material/button";
import {DataSourceComponent} from './data-source/data-source/data-source.component';
import {ClusterDataSourceService} from "./data-source/cluster-data-source.service";
import {FileUploadComponent} from './data-source/file-upload/file-upload.component';
import {MatIconModule} from "@angular/material/icon";
import {DragNDropDirective} from './data-source/drag-n-drop.directive';
import {SummaryComponent} from './data-source/pop-ups/summary/summary.component';
import {MatDialogModule} from "@angular/material/dialog";
import {MatCardModule} from "@angular/material/card";
import {MatDividerModule} from "@angular/material/divider";
import {MatInputModule} from "@angular/material/input";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ClusterDataService} from "./cluster-data.service";
import {ClusterService} from "./cluster.service";
import {HttpClientModule} from "@angular/common/http";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {LookUpComponent} from './data-source/look-up/look-up.component';
import {MatListModule} from "@angular/material/list";
import {FetchComponent} from './data-source/pop-ups/fetch/fetch.component';
import {MatSelectModule} from "@angular/material/select";
import {ClusterStorageService} from "./storage/cluster-storage.service";
import {MatTabsModule} from "@angular/material/tabs";
import {InProgressComponent} from './data-source/pop-ups/in-progress/in-progress.component';
import {ResetComponent} from './data-source/pop-ups/reset/reset.component';
import {FieldStarRemovalComponent} from './FSR/field-star-removal/field-star-removal.component';
import {HistogramSliderInputComponent} from './FSR/histogram-slider-input/histogram-slider-input.component';
import {NgChartsModule} from "ng2-charts";
import {HighchartsChartModule} from "highcharts-angular";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatSliderModule} from "@angular/material/slider";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {PieChartComponent} from './FSR/pie-chart/pie-chart.component';
import {PmChartComponent} from './FSR/pm-chart/pm-chart.component';
import {CmdFsrComponent} from './FSR/cmd-fsr/cmd-fsr.component';
import {ArchiveFetchingComponent} from './archive-feetching/archive-fetching/archive-fetching.component';
import {FetchPopupComponent} from './archive-feetching/fetch-popup/fetch-popup.component';
import {
    ArchiveFetchingGraphicsComponent
} from './archive-feetching/archive-fetching-graphics/archive-fetching-graphics.component';
import {IsochroneMatchingComponent} from './isochrone-matching/isochrone-matching/isochrone-matching.component';
import {InterfaceUtilModule} from "../shared/interface/util";
import {
    IsochronePlottingControlsComponent
} from './isochrone-matching/control-panel/isochrone-plotting-controls/isochrone-plotting-controls.component';
import {FilterControlsComponent} from './isochrone-matching/control-panel/filter-controls/filter-controls.component';
import {FilterSelectorComponent} from './isochrone-matching/control-panel/filter-selector/filter-selector.component';
import {PlotListsComponent} from './isochrone-matching/control-panel/plot-lists/plot-lists.component';
import {CdkDrag, CdkDragHandle, CdkDropList} from "@angular/cdk/drag-drop";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {ClusterIsochroneService} from "./isochrone-matching/cluster-isochrone.service";
import {ClusterPlotGridComponent} from './isochrone-matching/plots/cluster-plot-grid/cluster-plot-grid.component';
import {MatGridListModule} from "@angular/material/grid-list";
import {PlotComponent} from './isochrone-matching/plots/plot/plot.component';
import {ResultComponent} from './result/result/result.component';
import {MatSidenavModule} from "@angular/material/sidenav";
import {ResultSummaryComponent} from './result/result-summary/result-summary.component';
import {MatToolbarModule} from "@angular/material/toolbar";
import {ResultGraphicsComponent} from './result/result-graphics/result-graphics/result-graphics.component';
import {HrdResultComponent} from './result/result-graphics/hrd-result/hrd-result.component';
import {GalaxyFaceonComponent} from './result/result-graphics/galaxy-faceon/galaxy-faceon.component';
import {GalaxyEdgeonComponent} from './result/result-graphics/galaxy-edgeon/galaxy-edgeon.component';

const routes: Routes = [
    {path: '', component: ClusterComponent, title: 'Cluster'}
];

@NgModule({
    declarations: [ClusterComponent, ClusterStepperComponent, DataSourceComponent, FileUploadComponent, DragNDropDirective, SummaryComponent, LookUpComponent, FetchComponent, InProgressComponent, ResetComponent, FieldStarRemovalComponent, HistogramSliderInputComponent, PieChartComponent, PmChartComponent, CmdFsrComponent, ArchiveFetchingComponent, FetchPopupComponent, ArchiveFetchingGraphicsComponent, IsochroneMatchingComponent, IsochronePlottingControlsComponent, FilterControlsComponent, FilterSelectorComponent, PlotListsComponent, ClusterPlotGridComponent, PlotComponent, ResultComponent, ResultSummaryComponent, ResultGraphicsComponent, HrdResultComponent, GalaxyFaceonComponent, GalaxyEdgeonComponent],
    imports: [
        RouterModule.forChild(routes),
        CommonModule,
        MatStepperModule,
        MatButtonModule,
        MatIconModule,
        MatDialogModule,
        MatCardModule,
        MatDividerModule,
        MatInputModule,
        FormsModule,
        HttpClientModule,
        MatProgressSpinnerModule,
        MatProgressBarModule,
        ReactiveFormsModule,
        MatListModule,
        MatSelectModule,
        MatTabsModule,
        NgChartsModule,
        HighchartsChartModule,
        MatSlideToggleModule,
        MatSliderModule,
        MatSnackBarModule,
        InterfaceUtilModule,
        CdkDropList,
        CdkDrag,
        MatButtonToggleModule,
        CdkDragHandle,
        MatGridListModule,
        MatSidenavModule,
        MatToolbarModule,
    ],
    exports: [ClusterComponent, RouterModule],
    providers: [ClusterStorageService, ClusterDataSourceService,
        ClusterService, ClusterDataService, ClusterIsochroneService]
})
export class ClusterModule {
}
