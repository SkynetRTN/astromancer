import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {MatButtonModule,} from "@angular/material/button";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MenubarComponent} from './menubar/menubar.component';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ToolsNavbarComponent} from './tools-navbar/tools-navbar.component';
import {CurveComponent} from './tools/curve/curve.component';
import {HomeComponent} from './home/home.component';
import {AboutComponent} from './about/about.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {StandardLayoutComponent} from './tools/common/standard-layout/standard-layout.component';
import {StandardGraphInfoComponent} from './tools/common/standard-graph-info/standard-graph-info.component';
import {MatInputModule} from "@angular/material/input";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {GraphInfoDirective} from "./tools/common/directives/graph-info.directive";
import {DataControlDirective} from "./tools/common/directives/data-control.directive";
import {DataButtonDirective} from "./tools/common/directives/data-button.directive";
import {LineFormComponent} from './tools/curve/line-form/line-form.component';
import {MatSelectModule} from "@angular/material/select";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {SimpleTableImplComponent} from './tools/common/tables/simple-table-impl/simple-table-impl.component';
import {DataTableDirective} from './tools/common/directives/data-table.directive';
import {HotTableModule} from "@handsontable/angular";
import {registerAllModules} from 'handsontable/registry';
import {SimpleDataButtonComponent} from './tools/common/simple-data-button/simple-data-button.component';
import {ChartDirective} from "./tools/common/directives/chart.directive";
import {NgChartsModule} from 'ng2-charts';
import {CurveChartComponent} from './tools/curve/curve-chart/curve-chart.component';
import {SimpleGraphButtonComponent} from "./tools/common/simple-graph-button/simple-graph-button.component";
import {GraphButtonDirective} from "./tools/common/directives/graph-button.directive";
import {HonorCodePopupComponent} from "./tools/common/charts/honor-code-popup/honor-code-popup.component";
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
