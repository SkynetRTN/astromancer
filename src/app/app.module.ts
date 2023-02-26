import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {MatButtonModule, } from "@angular/material/button";
import {MatSidenavModule} from "@angular/material/sidenav";
import { MenubarComponent } from './menubar/menubar.component';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToolsNavbarComponent } from './tools-navbar/tools-navbar.component';
import { CurveComponent } from './tools/curve/curve.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { StandardLayoutComponent } from './tools/common/standard-layout/standard-layout.component';
import { StandardGraphInfoComponent } from './tools/common/standard-graph-info/standard-graph-info.component';
import {MatInputModule} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {GraphInfoDirective} from "./tools/common/directives/graph-info.directive";

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
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
