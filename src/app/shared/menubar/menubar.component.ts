import {Component, Input, NgModule} from '@angular/core';
import {ToolsNavbarComponent} from "../tools-navbar/tools-navbar.component";
import {AppRoutingModule} from "../../app-routing.module";
import {MatButtonModule} from "@angular/material/button";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";

/**
 * Menu Bar Component
 *
 * Menu bar for the entire app
 */
@Component({
  selector: 'app-menubar',
  templateUrl: './menubar.component.html',
  styleUrls: ['./menubar.component.css']
})
export class MenubarComponent {
  @Input() navbar!: ToolsNavbarComponent

  openToolNavbar() {
    this.navbar.open();
  }

}

@NgModule({
  imports: [
    AppRoutingModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
  ],
  declarations: [
    MenubarComponent
  ],
  exports: [MenubarComponent],
})
export class MenubarModule {
}

