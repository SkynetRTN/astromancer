import {ThemeOption} from "ngx-echarts";
import {ChartColor, ChartColorMode, ColorThemes} from "./appearance.utils";

const seriesColors = [0, 1, 2, 3].map((index) => ChartColor.getLineColor(index));

function getThemeTokens(theme: ColorThemes) {
  if (theme === ColorThemes.HIGH_CONTRAST_DARK) {
    return {
      backgroundColor: '#000000',
      textColor: '#FFEB3B',
      gridLineColor: 'rgba(255,255,255,0.35)',
    };
  }

  const chartMode = theme === ColorThemes.DARK ? ChartColorMode.DARK : ChartColorMode.LIGHT;
  return {
    backgroundColor: ChartColor.getBackgroundColor(chartMode),
    textColor: ChartColor.getFontColor(chartMode),
    gridLineColor: theme === ColorThemes.DARK ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.15)',
  };
}

const highchartsThemeTokens: Record<ColorThemes, {
  backgroundColor: string;
  textColor: string;
  gridLineColor: string;
  colors: string[];
}> = {
  [ColorThemes.LIGHT]: {
    backgroundColor: 'rgb(250, 250, 250)',
    textColor: '#333333',
    gridLineColor: '#e6e6e6',
    colors: [
      '#2caffe',
      '#544fc5',
      '#00e272',
      '#fe6a35',
      '#6b8abc',
      '#d568fb',
      '#2ee0ca',
      '#fa4b42',
      '#feb56a',
      '#91e8e1',
    ],
  },
  [ColorThemes.DARK]: {
    backgroundColor: 'rgb(48, 48, 48)',
    textColor: '#e0e0e3',
    gridLineColor: '#707073',
    colors: [
      '#2b908f',
      '#90ee7e',
      '#f45b5b',
      '#7798bf',
      '#aaeeee',
      '#ff0066',
      '#eeaaee',
      '#55bf3b',
      '#df5353',
      '#7798bf',
    ],
  },
  [ColorThemes.HIGH_CONTRAST_DARK]: {
    backgroundColor: 'rgb(48, 48, 48)',
    textColor: '#FFEB3B',
    gridLineColor: '#FFF59D',
    colors: [
      '#2b908f',
      '#90ee7e',
      '#f45b5b',
      '#7798bf',
      '#aaeeee',
      '#ff0066',
      '#eeaaee',
      '#55bf3b',
      '#df5353',
      '#7798bf',
    ],
  },
};

export function getEchartsTheme(theme: ColorThemes): ThemeOption {
  const {backgroundColor, textColor, gridLineColor} = getThemeTokens(theme);

  return {
    color: seriesColors,
    backgroundColor,
    textStyle: {
      color: textColor,
    },
    title: {
      textStyle: {
        color: textColor,
      },
    },
    legend: {
      textStyle: {
        color: textColor,
      },
    },
    tooltip: {
      backgroundColor,
      borderColor: gridLineColor,
      textStyle: {
        color: textColor,
      },
    },
    valueAxis: {
      axisLine: {
        lineStyle: {
          color: gridLineColor,
        },
      },
      axisTick: {
        lineStyle: {
          color: gridLineColor,
        },
      },
      axisLabel: {
        color: textColor,
      },
      nameTextStyle: {
        color: textColor,
      },
      splitLine: {
        lineStyle: {
          color: gridLineColor,
        },
      },
    },
    categoryAxis: {
      axisLine: {
        lineStyle: {
          color: gridLineColor,
        },
      },
      axisTick: {
        lineStyle: {
          color: gridLineColor,
        },
      },
      axisLabel: {
        color: textColor,
      },
      nameTextStyle: {
        color: textColor,
      },
      splitLine: {
        lineStyle: {
          color: gridLineColor,
        },
      },
    },
    logAxis: {
      axisLine: {
        lineStyle: {
          color: gridLineColor,
        },
      },
      axisTick: {
        lineStyle: {
          color: gridLineColor,
        },
      },
      axisLabel: {
        color: textColor,
      },
      nameTextStyle: {
        color: textColor,
      },
      splitLine: {
        lineStyle: {
          color: gridLineColor,
        },
      },
    },
    timeAxis: {
      axisLine: {
        lineStyle: {
          color: gridLineColor,
        },
      },
      axisTick: {
        lineStyle: {
          color: gridLineColor,
        },
      },
      axisLabel: {
        color: textColor,
      },
      nameTextStyle: {
        color: textColor,
      },
      splitLine: {
        lineStyle: {
          color: gridLineColor,
        },
      },
    },
  };
}

export function getHighchartsSeriesColor(theme: ColorThemes, index: number): string {
  const palette = highchartsThemeTokens[theme]?.colors ?? highchartsThemeTokens[ColorThemes.LIGHT].colors;
  if (index < 0 || index >= palette.length) {
    return palette[0];
  }
  return palette[index];
}

export function getHighchartsEchartsTheme(theme: ColorThemes): ThemeOption {
  const {backgroundColor, textColor, gridLineColor, colors} = highchartsThemeTokens[theme] ??
    highchartsThemeTokens[ColorThemes.LIGHT];

  return {
    color: colors,
    backgroundColor,
    textStyle: {
      color: textColor,
    },
    title: {
      textStyle: {
        color: textColor,
      },
    },
    legend: {
      textStyle: {
        color: textColor,
      },
    },
    tooltip: {
      backgroundColor,
      borderColor: gridLineColor,
      textStyle: {
        color: textColor,
      },
    },
    valueAxis: {
      axisLine: {
        lineStyle: {
          color: gridLineColor,
        },
      },
      axisTick: {
        lineStyle: {
          color: gridLineColor,
        },
      },
      axisLabel: {
        color: textColor,
      },
      nameTextStyle: {
        color: textColor,
      },
      splitLine: {
        lineStyle: {
          color: gridLineColor,
        },
      },
    },
    categoryAxis: {
      axisLine: {
        lineStyle: {
          color: gridLineColor,
        },
      },
      axisTick: {
        lineStyle: {
          color: gridLineColor,
        },
      },
      axisLabel: {
        color: textColor,
      },
      nameTextStyle: {
        color: textColor,
      },
      splitLine: {
        lineStyle: {
          color: gridLineColor,
        },
      },
    },
    logAxis: {
      axisLine: {
        lineStyle: {
          color: gridLineColor,
        },
      },
      axisTick: {
        lineStyle: {
          color: gridLineColor,
        },
      },
      axisLabel: {
        color: textColor,
      },
      nameTextStyle: {
        color: textColor,
      },
      splitLine: {
        lineStyle: {
          color: gridLineColor,
        },
      },
    },
    timeAxis: {
      axisLine: {
        lineStyle: {
          color: gridLineColor,
        },
      },
      axisTick: {
        lineStyle: {
          color: gridLineColor,
        },
      },
      axisLabel: {
        color: textColor,
      },
      nameTextStyle: {
        color: textColor,
      },
      splitLine: {
        lineStyle: {
          color: gridLineColor,
        },
      },
    },
  };
}
