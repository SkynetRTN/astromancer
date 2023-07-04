import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from "./shared/home/home.component";
import {AboutComponent} from "./shared/about/about.component";
import {PageNotFoundComponent} from "./shared/page-not-found/page-not-found.component";
import {SettingsComponent} from "./shared/settings/settings.component";
import {AppearanceComponent} from "./shared/settings/appearance/appearance.component";
import {VenusComponent} from "./tools/venus/venus/venus.component";

/**
 * Routes for the site
 */
const TOOLS_ROUTES: Routes = [
  {path: "home", component: HomeComponent, data: {title: getToolSiteName($localize`:home:Home`)}},
  {path: "about", component: AboutComponent, data: {title: getToolSiteName($localize`:about:About`)}},
  {path: "curve", loadChildren: () => import('./tools/curve/curve.module').then(m => m.CurveModule)},
  {path: "moon", loadChildren: () => import('./tools/moon/moon.module').then(m => m.MoonModule)},
  {path: "venus", loadChildren: () => import('./tools/venus/venus.module').then(m => m.VenusModule)},
  {path: "scatter", loadChildren: () => import('./tools/scatter/scatter.module').then(m => m.ScatterModule)},
  {path: "variable", loadChildren: () => import('./tools/variable/variable.module').then(m => m.VariableModule)},
  {path: "spectrum", loadChildren: () => import('./tools/spectrum/spectrum.module').then(m => m.SpectrumModule)},
  {path: "dual", loadChildren: () => import('./tools/dual/dual.module').then(m => m.DualModule)},
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
