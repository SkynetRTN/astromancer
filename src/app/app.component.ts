import {Component, Renderer2} from '@angular/core';

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

  constructor(private renderer: Renderer2) {
    const theme = "indigo-light-theme";
    const fontSize = "medium";
    this.renderer.addClass(document.body, fontSize);
    this.renderer.addClass(document.body, theme);
  }
}
