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
