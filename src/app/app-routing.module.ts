import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CurveComponent} from "./tools/curve/curve.component";
import {HomeComponent} from "./home/home.component";
import {AboutComponent} from "./about/about.component";
import {PageNotFoundComponent} from "./page-not-found/page-not-found.component";


const routes: Routes = [
  {path: "home", component: HomeComponent, data: {title: getToolSiteName("Home")}},
  {path: "about", component: AboutComponent, data: {title: getToolSiteName("About")}},
  {path: "curve", component: CurveComponent, data: {title: getToolSiteName("Curve")}},
  {path: '',   redirectTo: '/home', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
]

function getToolSiteName(tool: string): string{
  return "Skynet Plotting Neo " + tool;
}

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
