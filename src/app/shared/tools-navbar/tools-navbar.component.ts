import {Component, NgModule, ViewChild} from '@angular/core';
import {MatSidenav, MatSidenavModule} from '@angular/material/sidenav';
import {MenubarModule} from "../menubar/menubar.component";
import {AppRoutingModule} from "../../app-routing.module";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
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
