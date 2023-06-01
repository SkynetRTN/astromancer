import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ToolsNavbarModule} from './shared/tools-navbar/tools-navbar.component';
import {registerAllModules} from 'handsontable/registry';
import {HomeComponent} from "./shared/home/home.component";
import {AboutComponent} from "./shared/about/about.component";
import {PageNotFoundComponent} from "./shared/page-not-found/page-not-found.component";
import {HonorCodePopupModule} from "./tools/shared/honor-code-popup/honor-code-popup.module";
import {SettingsModule} from './shared/settings/settings.component';
import {AppearanceComponent} from './shared/settings/appearance/appearance.component';
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {ReactiveFormsModule} from "@angular/forms";
import {AppearanceStorageService} from "./shared/settings/appearance/service/appearance-storage.service";
import {MatButtonModule} from "@angular/material/button";
import {AppearanceService} from "./shared/settings/appearance/service/appearance.service";


registerAllModules();

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ToolsNavbarModule,
    HonorCodePopupModule,
    SettingsModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatButtonModule
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    PageNotFoundComponent,
    AppearanceComponent,
  ],
  providers: [AppearanceStorageService, AppearanceService],
  bootstrap: [AppComponent],
})
export class AppModule {
}
