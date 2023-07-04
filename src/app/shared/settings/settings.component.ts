import {Component, NgModule, OnInit} from '@angular/core';
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatLegacyButtonModule as MatButtonModule} from "@angular/material/legacy-button";
import {MatIconModule} from "@angular/material/icon";
import {MatLegacyListModule as MatListModule} from "@angular/material/legacy-list";
import {RouterLink, RouterLinkActive, RouterModule, RouterOutlet, Routes} from "@angular/router";
import {AppearanceComponent} from "./appearance/appearance.component";
import {CommonModule} from "@angular/common";

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

const routes: Routes = [
  {path: '', component: SettingsComponent, title: 'Settings',
    children:
    [
      {path: '', pathMatch: 'full', redirectTo: 'appearance'},
      {path: 'appearance', component: AppearanceComponent, title: 'Appearance Settings'}
    ]
  },
]

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
  ],
  declarations: [
    SettingsComponent,
  ],
  exports: [RouterModule]
})
export class SettingsModule {
}
