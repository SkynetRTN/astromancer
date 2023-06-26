import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CurveComponent} from "./tools/curve/curve.component";
import {HomeComponent} from "./shared/home/home.component";
import {AboutComponent} from "./shared/about/about.component";
import {PageNotFoundComponent} from "./shared/page-not-found/page-not-found.component";
import {SettingsComponent} from "./shared/settings/settings.component";
import {AppearanceComponent} from "./shared/settings/appearance/appearance.component";
import {MoonComponent} from "./tools/moon/moon/moon.component";
import {VenusComponent} from "./tools/venus/venus/venus.component";

/**
 * Routes for the site
 */
const TOOLS_ROUTES: Routes = [
  {path: "home", component: HomeComponent, data: {title: getToolSiteName($localize`:home:Home`)}},
  {path: "about", component: AboutComponent, data: {title: getToolSiteName($localize`:about:About`)}},
  {path: "curve", component: CurveComponent, data: {title: getToolSiteName($localize`:curve:Curve`)}},
  {path: "moon", component: MoonComponent, data: {title: getToolSiteName($localize`:moon:Moon`)}},
  {path: "venus", component: VenusComponent, data: {title: getToolSiteName($localize`:venus:Venus`)}},
  {
    path: "settings", component: SettingsComponent, data: {title: getToolSiteName($localize`:settings:Settings`)},
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'appearance'
      },
      {
        path: 'appearance',
        component: AppearanceComponent,
        data: {title: 'Appearance Settings'},
      },]
  },
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: '**', component: PageNotFoundComponent, data: {title: $localize`:page-not-found:Page Not Found`}}
]

/**
 * Generate name of the site based on the graphing tool in use.
 * @param tool the graphing tool in use
 * @returns
 */
function getToolSiteName(tool: string): string {
  return $localize`:site-name:Skynet Plotting Neo` + tool;
}

@NgModule({
  imports: [RouterModule.forRoot(TOOLS_ROUTES)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
