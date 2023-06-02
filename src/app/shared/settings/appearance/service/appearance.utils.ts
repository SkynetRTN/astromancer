export interface MyColorTheme {
  key: string;
  displayName: string;
}

export enum ColorThemes {
  LIGHT = 'LIGHT_THEME',
  DARK = 'DARK_THEME',
  // HIGH_CONTRAST = 'HC_THEME',
  HIGH_CONTRAST_DARK = 'HC_DARK_THEME'
}

export interface MyFontStyle {
  key: string;
  displayName: string;
}

export enum FontStyles {
  DEFAULT = 'normal',
  BOLD = 'bold',
  EXTRA_BOLD = 'bolder',
}

export interface MyFontSize {
  key: string;
  displayName: string;
}

export enum FontSizes {
  SMALL = "small",
  DEFAULT = "default",
  LARGE = "large",
  LARGER = "larger",
}

export class ColorThemeSettings {
  public static getThemeLists(): MyColorTheme[] {
    return [
      {key: ColorThemes.LIGHT, displayName: 'Light'},
      {key: ColorThemes.DARK, displayName: 'Dark'},
      // {key: ColorThemes.HIGH_CONTRAST, displayName: 'High Contrast'},
      {key: ColorThemes.HIGH_CONTRAST_DARK, displayName: 'High Contrast Dark'}
    ];
  }

  public static getFontStyleLists(): MyFontStyle[] {
    return [
      {key: FontStyles.DEFAULT, displayName: 'Default'},
      {key: FontStyles.BOLD, displayName: 'Bold'},
      {key: FontStyles.EXTRA_BOLD, displayName: 'Extra Bold'}
    ]
  }

  public static getFontSizeLists(): MyFontSize[] {
    return [
      {key: FontSizes.SMALL, displayName: 'Small'},
      {key: FontSizes.DEFAULT, displayName: 'Default'},
      {key: FontSizes.LARGE, displayName: 'Large'},
      {key: FontSizes.LARGER, displayName: 'Larger'}
    ]
  }
}

export class DefaultAppearanceSettings {
  public static theme: ColorThemes = ColorThemes.LIGHT;
  public static fontStyle: FontStyles = FontStyles.DEFAULT;
  public static fontSize: FontSizes = FontSizes.DEFAULT;
}
