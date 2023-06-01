import {Injectable, Renderer2, RendererFactory2} from '@angular/core';
import {ColorThemes, FontSizes, FontStyles} from "./appearance.utils";
import {AppearanceStorageService} from "./appearance-storage.service";

@Injectable({
  providedIn: 'root',
})
export class AppearanceService {
  private renderer: Renderer2;

  constructor(private storageService: AppearanceStorageService, private rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(document.body, null);
  }

  public setFontSize(fontSize: FontSizes): void {
    this.renderer.removeClass(document.body, this.getFontSizeClassname(this.getFontSize()));
    this.renderer.addClass(document.body, this.getFontSizeClassname(fontSize));
    this.storageService.setFontSize(fontSize);
  }

  public getFontSize(): FontSizes {
    return this.storageService.getFontSize();
  }

  public setColorTheme(colorTheme: ColorThemes): void {

  }

  public getColorTheme(): ColorThemes {
    return this.storageService.getColorTheme();
  }

  public setFontStyle(fontStyle: FontStyles): void {
    this.renderer.removeClass(document.body, this.getFontStyleClassname(this.getFontStyle()));
    this.renderer.addClass(document.body, this.getFontStyleClassname(fontStyle));
    this.storageService.setFontStyle(fontStyle);
  }

  public getFontStyle(): FontStyles {
    return this.storageService.getFontStyle();
  }


  private getFontSizeClassname(fontSize: FontSizes): string {
    return 'fontSize-' + fontSize;
  }

  private getFontStyleClassname(fontStyle: FontStyles): string {
    return 'fontStyle-' + fontStyle;
  }
}
