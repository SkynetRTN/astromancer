import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from "./shared/home/home.component";
import {AboutComponent} from "./shared/about/about.component";
import {PageNotFoundComponent} from "./shared/page-not-found/page-not-found.component";

/**
 * Routes for the site
 */
const TOOLS_ROUTES: Routes = [
    {path: "home", component: HomeComponent, title: getToolSiteName($localize`:by Skynet:by Skynet`)},
    {path: "about", component: AboutComponent, title: getToolSiteName($localize`:about:About`)},
    {path: "curve", loadChildren: () => import('./tools/curve/curve.module').then(m => m.CurveModule)},
    {path: "moon", loadChildren: () => import('./tools/moon/moon.module').then(m => m.MoonModule)},
    {path: "venus", loadChildren: () => import('./tools/venus/venus.module').then(m => m.VenusModule)},
    {path: "scatter", loadChildren: () => import('./tools/scatter/scatter.module').then(m => m.ScatterModule)},
    {path: "variable", loadChildren: () => import('./tools/variable/variable.module').then(m => m.VariableModule)},
    {path: "spectrum", loadChildren: () => import('./tools/spectrum/spectrum.module').then(m => m.SpectrumModule)},
    {path: "dual", loadChildren: () => import('./tools/dual/dual.module').then(m => m.DualModule)},
    {path: "radiosearch", loadChildren: () => import('./tools/radiosearch/radiosearch.module').then(m => m.RadioSearchModule)},
    {path: "pulsar", loadChildren: () => import('./tools/pulsar/pulsar.module').then(m => m.PulsarModule)},
    {path: "pulsar-test", loadChildren: () => import('./tools/pulsar/pulsar.module').then(m => m.PulsarModule)},
    {path: "cluster", loadChildren: () => import('./tools/cluster/cluster.module').then(m => m.ClusterModule)},
    {path: "rc", loadChildren: () => import('./tools/rc/rc.module').then(m => m.RcModule)},
    {path: "settings", loadChildren: () => import('./shared/settings/settings.module').then(m => m.SettingsModule)},
    {path: '', redirectTo: '/home', pathMatch: 'full'},
    {path: '**', component: PageNotFoundComponent, title: $localize`:page-not-found:Page Not Found`},

    
]

/**
 * Generate name of the site based on the graphing tool in use.
 * @param tool the graphing tool in use
 * @returns
 */
function getToolSiteName(tool: string): string {
    return $localize`:site-name:Astromancer ` + tool;
}

@NgModule({
    imports: [RouterModule.forRoot(TOOLS_ROUTES)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
