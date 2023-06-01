import {Component, NgModule, OnInit} from '@angular/core';
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatListModule} from "@angular/material/list";
import {RouterLinkActive, RouterLinkWithHref, RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }

}

@NgModule({
  imports: [
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    RouterOutlet,
    RouterLinkWithHref,
    RouterLinkActive,
  ],
  declarations: [
    SettingsComponent,
  ],
})
export class SettingsModule {

}
