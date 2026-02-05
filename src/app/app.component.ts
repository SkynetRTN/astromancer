import {Component, HostListener} from '@angular/core';
import {AppearanceService} from "./shared/settings/appearance/service/appearance.service";
import { Router } from '@angular/router';

/**
 * App Component
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  /**
   * Default title of the site
   */
  title = 'Astromancer by Skynet';

  constructor(private appearanceService: AppearanceService, private router: Router) {
    this.appearanceService.intialize();
  }
  
  @HostListener('window:resize', ['$event'])
  onResize() {
    const excludedRoute = '/radio-source-finder';

    if (this.router.url !== excludedRoute) {
      // location.reload();
    }
  }
}
