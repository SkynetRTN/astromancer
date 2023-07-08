import {Component, HostListener} from '@angular/core';
import {AppearanceService} from "./shared/settings/appearance/service/appearance.service";

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

  constructor(private appearanceService: AppearanceService) {
    this.appearanceService.intialize();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    location.reload();
  }

}
