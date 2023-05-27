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


registerAllModules();

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ToolsNavbarModule,
    HonorCodePopupModule,
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    PageNotFoundComponent
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
}
