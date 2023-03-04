import {Component, NgModule, ViewChild} from '@angular/core';
import {MatSidenav, MatSidenavModule} from '@angular/material/sidenav';
import {MenubarModule} from "../menubar/menubar.component";
import {AppRoutingModule} from "../../app-routing.module";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {CurveModule} from "../../tools/curve/curve.module";

/**
 * Side Nav Component
 *
 * Sidenav with custom escape and backdrop click behavior
 *
 * Contains menubar and router outlet to plotting tools
 *
 * */
@Component({
  selector: 'app-tools-navbar',
  templateUrl: 'tools-navbar.component.html',
  styleUrls: ['tools-navbar.component.css'],
})
export class ToolsNavbarComponent {
  @ViewChild('toolsnav') toolsnav!: MatSidenav;

  open() {
    this.toolsnav.open();
  }

  close() {
    this.toolsnav.close();
  }

}

@NgModule({
  imports: [
    MenubarModule,
    CurveModule,
    AppRoutingModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
  ],
  declarations: [
    ToolsNavbarComponent,
  ],
  exports: [ToolsNavbarComponent]
})
export class ToolsNavbarModule {
}
