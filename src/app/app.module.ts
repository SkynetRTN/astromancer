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
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MarkdownModule} from "ngx-markdown";
import {HttpClientModule} from "@angular/common/http";


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
