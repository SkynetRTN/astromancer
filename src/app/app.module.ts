import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {MatButtonModule,} from "@angular/material/button";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MenubarComponent} from './shared/menubar/menubar.component';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ToolsNavbarComponent} from './shared/tools-navbar/tools-navbar.component';
import {CurveComponent} from './tools/curve/curve.component';
import {HomeComponent} from './shared/home/home.component';
import {AboutComponent} from './shared/about/about.component';
import {PageNotFoundComponent} from './shared/page-not-found/page-not-found.component';
import {StandardLayoutComponent} from './tools/shared/standard-layout/standard-layout.component';
import {StandardGraphInfoComponent} from './tools/shared/standard-graph-info/standard-graph-info.component';
import {MatInputModule} from "@angular/material/input";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {GraphInfoDirective} from "./tools/shared/directives/graph-info.directive";
import {DataControlDirective} from "./tools/shared/directives/data-control.directive";
import {DataButtonDirective} from "./tools/shared/directives/data-button.directive";
import {LineFormComponent} from './tools/curve/line-form/line-form.component';
import {MatSelectModule} from "@angular/material/select";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {SimpleTableImplComponent} from './tools/shared/tables/simple-table-impl/simple-table-impl.component';
import {DataTableDirective} from './tools/shared/directives/data-table.directive';
import {HotTableModule} from "@handsontable/angular";
import {registerAllModules} from 'handsontable/registry';
import {SimpleDataButtonComponent} from './tools/shared/simple-data-button/simple-data-button.component';
import {ChartDirective} from "./tools/shared/directives/chart.directive";
import {NgChartsModule} from 'ng2-charts';
import {CurveChartComponent} from './tools/curve/curve-chart/curve-chart.component';
import {SimpleGraphButtonComponent} from "./tools/shared/simple-graph-button/simple-graph-button.component";
import {GraphButtonDirective} from "./tools/shared/directives/graph-button.directive";
import {HonorCodePopupComponent} from "./tools/shared/charts/honor-code-popup/honor-code-popup.component";
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';


registerAllModules();

@NgModule({
  declarations: [
    AppComponent,
    ToolsNavbarComponent,
    MenubarComponent,
    CurveComponent,
    HomeComponent,
    AboutComponent,
    PageNotFoundComponent,
    StandardLayoutComponent,
    StandardGraphInfoComponent,
    GraphInfoDirective,
    DataControlDirective,
    LineFormComponent,
    SimpleTableImplComponent,
    DataTableDirective,
    SimpleDataButtonComponent,
    DataButtonDirective,
    ChartDirective,
    CurveChartComponent,
    GraphButtonDirective,
    SimpleGraphButtonComponent,
    HonorCodePopupComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatInputModule,
    FormsModule,
    MatSelectModule,
    MatButtonToggleModule,
    HotTableModule,
    NgChartsModule,
    NgbModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
