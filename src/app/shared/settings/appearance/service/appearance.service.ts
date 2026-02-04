import {Injectable, Renderer2, RendererFactory2} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {
  ChartColor,
  ChartColorMode,
  ColorThemes,
  DefaultAppearanceSettings,
  FontFamily,
  FontSizes,
  FontStyles
} from "./appearance.utils";
import {AppearanceStorageService} from "./appearance-storage.service";

@Injectable({
  providedIn: 'root',
})
export class AppearanceService {
  private renderer: Renderer2;
  private colorThemeSubject = new BehaviorSubject<ColorThemes>(this.getColorTheme());
  public colorTheme$ = this.colorThemeSubject.asObservable();

  constructor(private storageService: AppearanceStorageService, private rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(document.body, null);
  }

  public intialize(): void {
    this.setColorTheme(this.getColorTheme());
    this.setFontFamily(this.getFontFamily());
    this.setFontSize(this.getFontSize());
    this.setFontStyle(this.getFontStyle());
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
    this.renderer.removeClass(document.body, this.getColorTheme());
    this.renderer.addClass(document.body, colorTheme);
    this.storageService.setColorTheme(colorTheme);
    this.colorThemeSubject.next(colorTheme);
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

  public setFontFamily(fontFamily: FontFamily): void {
    this.renderer.removeClass(document.body, this.getFontFamilyClassname(this.getFontFamily()));
    this.renderer.addClass(document.body, this.getFontFamilyClassname(fontFamily));
    this.storageService.setFont(fontFamily);
  }

  public getFontFamily(): FontFamily {
    return this.storageService.getFont();
  }

  public getChartFontColor(): string {
    return ChartColor.getFontColor(this.getChartColorMode());
  }

  public getChartBackgroundColor(): string {
    return ChartColor.getBackgroundColor(this.getChartColorMode());
  }

  public getChartAreaColor(): string {
    return ChartColor.getAreaColor(this.getChartColorMode());
  }

  private getFontSizeClassname(fontSize: FontSizes): string {
    return 'fontSize-' + fontSize;
  }

  private getFontStyleClassname(fontStyle: FontStyles): string {
    return 'fontStyle-' + fontStyle;
  }

  private getFontFamilyClassname(font: FontFamily): string {
    return 'fontFamily-' + font;
  }

  private getChartColorMode(): ChartColorMode {
    if (this.getColorTheme() === ColorThemes.LIGHT)
      return ChartColorMode.LIGHT;
    else if (this.getColorTheme() === ColorThemes.DARK)
      return ChartColorMode.DARK;
    else
      return DefaultAppearanceSettings.chartColorMode;
  }

}
