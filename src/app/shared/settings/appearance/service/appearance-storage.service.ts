import {Injectable} from '@angular/core';
import {
  ChartColorMode,
  ColorThemes,
  DefaultAppearanceSettings,
  FontFamily,
  FontSizes,
  FontStyles
} from "./appearance.utils";

@Injectable({
  providedIn: 'root'
})
export class AppearanceStorageService {
  private colorTheme!: ColorThemes;
  private fontStyle!: FontStyles;
  private fontSize!: FontSizes;
  private font!: FontFamily;
  private chartColorMode!: ChartColorMode;
  private readonly colorThemeKey = "colorTheme";
  private readonly fontStyleKey = "fontStyle";
  private readonly fontSizeKey = "fontSize";
  private readonly fontKey = "font";
  private readonly chartColorModeKey = "chartColorMode";

  constructor() {
  }

  public setColorTheme(colorTheme: ColorThemes): void {
    localStorage.setItem(this.colorThemeKey, JSON.stringify(colorTheme));
  }

  public getColorTheme(): ColorThemes {
    if (localStorage.getItem(this.colorThemeKey) !== null) {
      this.colorTheme = JSON.parse(localStorage.getItem(this.colorThemeKey) as string);
    } else {
      this.colorTheme = DefaultAppearanceSettings.theme;
    }
    return this.colorTheme;
  }

  public setFontStyle(fontStyle: FontStyles): void {
    localStorage.setItem(this.fontStyleKey, JSON.stringify(fontStyle));
  }

  public getFontStyle(): FontStyles {
    if (localStorage.getItem(this.fontStyleKey) !== null) {
      this.fontStyle = JSON.parse(localStorage.getItem(this.fontStyleKey) as string);
    } else {
      this.fontStyle = DefaultAppearanceSettings.fontStyle;
    }
    return this.fontStyle;
  }

  public setFontSize(fontSize: FontSizes): void {
    localStorage.setItem(this.fontSizeKey, JSON.stringify(fontSize));
  }

  public getFontSize(): FontSizes {
    if (localStorage.getItem(this.fontSizeKey) !== null) {
      this.fontSize = JSON.parse(localStorage.getItem(this.fontSizeKey) as string);
    } else {
      this.fontSize = DefaultAppearanceSettings.fontSize;
    }
    return this.fontSize;
  }

  public setFont(font: FontFamily): void {
    localStorage.setItem(this.fontKey, JSON.stringify(font));
  }

  public getFont(): FontFamily {
    if (localStorage.getItem(this.fontKey) !== null) {
      this.font = JSON.parse(localStorage.getItem(this.fontKey) as string);
    } else {
      this.font = DefaultAppearanceSettings.fontFamily;
    }
    return this.font;
  }

}
