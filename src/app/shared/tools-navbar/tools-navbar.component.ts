import {Component, NgModule, ViewChild} from '@angular/core';
import {MatSidenav, MatSidenavModule} from '@angular/material/sidenav';
import {MenubarModule} from "../menubar/menubar.component";
import {AppRoutingModule} from "../../app-routing.module";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {CurveModule} from "../../tools/curve/curve.module";
import {MatListModule} from "@angular/material/list";

/**
 * Sidenav with custom escape and backdrop click behavior
 *
 * Contains menubar and router outlet to plotting tools
 *
 * */
@Component({
  selector: 'app-tools-navbar',
  templateUrl: 'tools-navbar.component.html',
  styleUrls: ['tools-navbar.component.scss'],
})
export class ToolsNavbarComponent {
  /**
   * Navigation bar for selecting tools
   */
  @ViewChild('toolsnav') toolsnav!: MatSidenav;

  /**
   * open the navigation bar {@link toolsnav}
   */
  open() {
    this.toolsnav.open();
  }

  /**
   * open the navigation bar {@link toolsnav}
   */
  close() {
    this.toolsnav.close();
  }

}

/**
 * Encapsulate {@link ToolsNavbarComponent}
 */
@NgModule({
  imports: [
    MenubarModule,
    CurveModule,
    AppRoutingModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
  ],
  declarations: [
    ToolsNavbarComponent,
  ],
  exports: [ToolsNavbarComponent]
})
export class ToolsNavbarModule {
}
