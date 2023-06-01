import {Component} from '@angular/core';
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
  title = 'skynet-plotting-neo';

  constructor(private appearanceService: AppearanceService) {
    this.appearanceService.setFontSize(this.appearanceService.getFontSize());
  }
}
