import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ToolsNavbarModule} from './shared/tools-navbar/tools-navbar.component';
import {registerAllModules} from 'handsontable/registry';
import {HomeComponent} from "./shared/home/home.component";
import {AboutComponent} from "./shared/about/about.component";
import {PageNotFoundComponent} from "./shared/page-not-found/page-not-found.component";
import {HonorCodePopupModule} from "./tools/shared/honor-code-popup/honor-code-popup.module";
import {ReactiveFormsModule} from "@angular/forms";
import {AppearanceStorageService} from "./shared/settings/appearance/service/appearance-storage.service";
import {AppearanceService} from "./shared/settings/appearance/service/appearance.service";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {MatButtonModule} from "@angular/material/button";
import {MatTableModule} from '@angular/material/table';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MarkdownModule} from "ngx-markdown";
import {HttpClientModule} from "@angular/common/http";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatCardModule} from "@angular/material/card";
import {CurveModule} from "./tools/curve/curve.module";
import {MoonModule} from "./tools/moon/moon.module";
import {VenusModule} from "./tools/venus/venus.module";
import {VariableModule} from "./tools/variable/variable.module";
import {ScatterModule} from "./tools/scatter/scatter.module";
import {SpectrumModule} from "./tools/spectrum/spectrum.module";
import {DualModule} from "./tools/dual/dual.module";
import {RadioSearchModule} from "./tools/radiosearch/radiosearch.module";
import {PulsarModule} from './tools/pulsar/pulsar.module';
import {RcModule} from "./tools/rc/rc.module";
import {NgOptimizedImage} from "@angular/common";


registerAllModules();

@NgModule({
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        ToolsNavbarModule,
        HonorCodePopupModule,
        MatInputModule,
        MatSelectModule,
        ReactiveFormsModule,
        MatButtonModule,
        HttpClientModule,
        MarkdownModule.forRoot({loader: HttpClientModule}),
        MatGridListModule,
        MatCardModule,
        MatTableModule,
        CurveModule,
        MoonModule,
        VenusModule,
        VariableModule,
        ScatterModule,
        SpectrumModule,
        DualModule,
        RadioSearchModule,
        PulsarModule,
        RcModule,
        NgOptimizedImage,
    ],
    declarations: [
        AppComponent,
        HomeComponent,
        AboutComponent,
        PageNotFoundComponent,
    ],
    providers: [AppearanceStorageService, AppearanceService],
    bootstrap: [AppComponent],
})
export class AppModule {
}
