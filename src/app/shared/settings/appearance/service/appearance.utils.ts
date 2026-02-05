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

export enum FontFamily {
  ROBOTO = 'Roboto',
  COMIC_NEUE = 'Comic-Neue',
}

export interface MyFontFamily {
  key: string;
  displayName: string;
}

export class ColorThemeSettings {
  public static getThemeLists(): MyColorTheme[] {
    return [
      { key: ColorThemes.LIGHT, displayName: 'Light' },
      { key: ColorThemes.DARK, displayName: 'Dark' },
      // {key: ColorThemes.HIGH_CONTRAST, displayName: 'High Contrast'},
      { key: ColorThemes.HIGH_CONTRAST_DARK, displayName: 'High Contrast Dark' }
    ];
  }

  public static getFontStyleLists(): MyFontStyle[] {
    return [
      { key: FontStyles.DEFAULT, displayName: 'Default' },
      { key: FontStyles.BOLD, displayName: 'Bold' },
      { key: FontStyles.EXTRA_BOLD, displayName: 'Extra Bold' }
    ]
  }

  public static getFontSizeLists(): MyFontSize[] {
    return [
      { key: FontSizes.SMALL, displayName: 'Small' },
      { key: FontSizes.DEFAULT, displayName: 'Default' },
      { key: FontSizes.LARGE, displayName: 'Large' },
      { key: FontSizes.LARGER, displayName: 'Larger' }
    ]
  }

  public static getFontFamilyLists(): MyFontFamily[] {
    return [
      { key: FontFamily.ROBOTO, displayName: 'Roboto' },
      { key: FontFamily.COMIC_NEUE, displayName: 'Comic Neue' }
    ]
  }

  public static getChartTypeLists(): MyChartType[] {
    return [
      { key: ChartType.HIGHCHARTS, displayName: 'Highcharts' },
      { key: ChartType.ECHARTS, displayName: 'ECharts' }
    ]
  }
}

export enum ChartColorMode {
  LIGHT = 'LIGHT',
  DARK = 'DARK'
}


export enum ChartType {
  HIGHCHARTS = 'HIGHCHARTS',
  ECHARTS = 'ECHARTS'
}

export interface MyChartType {
  key: string;
  displayName: string;
}

export class DefaultAppearanceSettings {
  public static theme: ColorThemes = ColorThemes.LIGHT;
  public static fontStyle: FontStyles = FontStyles.DEFAULT;
  public static fontSize: FontSizes = FontSizes.DEFAULT;
  public static fontFamily: FontFamily = FontFamily.ROBOTO;
  public static chartColorMode: ChartColorMode = ChartColorMode.LIGHT;
  public static chartType: ChartType = ChartType.HIGHCHARTS;
}


export class ChartColor {
  private static readonly lineColorLightArray: string[] = ["#2caffe", "#544fc5", "#00e272", "#fe6a35"];
  private static readonly lineColorDarkArray: string[] = ["#2b908f", "#90ee7e", "#f45b5b", "#7798bf"];
  private static readonly areaColor: string[] = ['#464646']

  public static getFontColor(mode: ChartColorMode): string {
    return mode === ChartColorMode.LIGHT ? '#2b4162' : '#f5f0f6';
  }

  public static getBackgroundColor(mode: ChartColorMode): string {
    return mode === ChartColorMode.LIGHT ? '#FAFAFA' : '#303030';
  }

  public static getLineColor(index: number, mode: ChartColorMode = ChartColorMode.LIGHT): string {
    const colors = mode === ChartColorMode.LIGHT ? this.lineColorLightArray : this.lineColorDarkArray;
    if (index < 0 || index >= colors.length)
      return 'black';
    else
      return colors[index];
  }

  public static getAreaColor(mode: ChartColorMode): string {
    return this.areaColor[0];
  }


}
