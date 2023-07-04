import {NgModule} from "@angular/core";
import {RouterLink, RouterLinkActive, RouterModule, RouterOutlet, Routes} from "@angular/router";
import {CommonModule} from "@angular/common";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatLegacyButtonModule as MatButtonModule} from "@angular/material/legacy-button";
import {MatIconModule} from "@angular/material/icon";
import {MatLegacyListModule as MatListModule} from "@angular/material/legacy-list";
import {SettingsComponent} from "./settings.component";
import {AppearanceComponent} from "./appearance/appearance.component";
import {LocalStorageComponent} from "./local-storage/local-storage.component";
import {ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";

const routes: Routes = [
  {
    path: '', component: SettingsComponent, title: 'Settings',
    children:
      [
        {path: '', pathMatch: 'full', redirectTo: 'appearance'},
        {path: 'appearance', component: AppearanceComponent, title: 'Appearance Settings'},
        {path: 'local-storage', component: LocalStorageComponent, title: 'Local Storage Settings'},
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
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
  ],
  declarations: [
    SettingsComponent,
    AppearanceComponent,
    LocalStorageComponent,
  ],
  exports: [RouterModule]
})
export class SettingsModule {
}
