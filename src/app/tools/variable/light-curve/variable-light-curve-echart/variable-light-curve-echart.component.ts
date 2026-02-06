import { AfterViewInit, Component, ElementRef, OnDestroy } from '@angular/core';
import { ECharts, EChartsOption } from 'echarts';
import { ThemeOption } from 'ngx-echarts';
import { Subject, takeUntil } from 'rxjs';
import { AppearanceService } from '../../../../shared/settings/appearance/service/appearance.service';
import { getEchartsTheme } from '../../../../shared/settings/appearance/service/echarts-theme';
import { VariableService } from '../../variable.service';
import { VariableStarOptions } from '../../variable.service.util';

const GRID_LEFT = 48;
const GRID_RIGHT = 24;
const GRID_TOP = 64;
const GRID_BOTTOM = 48;

@Component({
    selector: 'app-variable-light-curve-echart',
    templateUrl: './variable-light-curve-echart.component.html',
    styleUrls: ['./variable-light-curve-echart.component.scss']
})
export class VariableLightCurveEchartComponent implements AfterViewInit, OnDestroy {
    chartOptions: EChartsOption = {};
    chartTheme: ThemeOption | string;
    private chartInstance?: ECharts;
    private destroy$: Subject<void> = new Subject<void>();
    private resizeObserver: ResizeObserver;

    constructor(
        private service: VariableService,
        private appearanceService: AppearanceService,
        private elementRef: ElementRef
    ) {
        this.chartTheme = getEchartsTheme(this.appearanceService.getColorTheme());

        this.resizeObserver = new ResizeObserver(() => {
            if (this.chartInstance) {
                this.chartInstance.resize();
                this.refreshChart();
            }
        });
    }

    onChartInit(chart: ECharts) {
        this.chartInstance = chart;
        // this.service.setEChartLightCurve(chart); // TODO: Add this method to service
        this.refreshChart();
    }

    ngAfterViewInit(): void {
        this.service.data$
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => this.refreshChart());
        this.service.chartInfo$
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => this.refreshChart());
        this.service.interface$
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => this.refreshChart());
        this.appearanceService.colorTheme$
            .pipe(takeUntil(this.destroy$))
            .subscribe((theme) => {
                this.chartTheme = getEchartsTheme(theme);
            });

        this.resizeObserver.observe(this.elementRef.nativeElement);
    }

    ngOnDestroy(): void {
        this.resizeObserver.disconnect();
        this.destroy$.next();
        this.destroy$.complete();
    }

    private refreshChart(): void {
        this.chartOptions = this.buildChartOptions();
        this.chartInstance?.setOption(this.chartOptions, true);
    }

    private buildChartOptions(): EChartsOption {
        const dataLabel = this.service.getDataLabel();
        const sourceLabels = this.service.getDataLabelArray();
        const sourcesData = this.service.getChartSourcesDataArray();
        const sourcesError = this.service.getChartSourcesErrorArray();
        const variableData = this.service.getChartVariableDataArray();
        const variableError = this.service.getChartVariableErrorArray();
        const showVariable = this.service.getVariableStar() !== VariableStarOptions.NONE;

        const allDataPoints: number[][] = [];
        if (!showVariable) {
            sourcesData.forEach(d => d.forEach(p => { if (p[0] !== null && p[1] !== null) allDataPoints.push([p[0], p[1]]) }));
        } else {
            variableData.forEach(p => { if (p[0] !== null && p[1] !== null) allDataPoints.push([p[0], p[1]]) });
        }

        const extents = this.getAxisExtents(allDataPoints);

        const series = [];

        // Sources
        if (!showVariable) {
            for (let i = 0; i < 2; i++) {
                series.push({
                    name: sourceLabels[i],
                    type: 'scatter',
                    data: sourcesData[i].map(d => [d[0], d[1]]), // Ensure data is in [x, y] format
                    symbolSize: 6,
                    itemStyle: {
                        color: i === 0 ? '#5470c6' : '#91cc75' // Use distinct colors or theme colors
                    }
                });

                // Error bars for sources
                // ECharts custom series for error bars
                const errorData = sourcesError[i].map(d => [d[0], d[1], d[2]]); // [x, lower, upper]
                series.push({
                    type: 'custom',
                    name: sourceLabels[i] + ' Error',
                    itemStyle: {
                        borderWidth: 1.5,
                        color: i === 0 ? '#5470c6' : '#91cc75'
                    },
                    renderItem: this.renderErrorBar,
                    encode: {
                        x: 0,
                        y: [1, 2]
                    },
                    data: errorData,
                    z: 100
                });
            }
        }

        // Variable
        if (showVariable) {
            series.push({
                name: dataLabel,
                type: 'scatter',
                data: variableData.map(d => [d[0], d[1]]),
                symbolSize: 6,
                itemStyle: {
                    color: '#fac858'
                }
            });

            const varErrorData = variableError.map(d => [d[0], d[1], d[2]]);
            series.push({
                type: 'custom',
                name: 'Error',
                itemStyle: {
                    borderWidth: 1.5,
                    color: '#fac858'
                },
                renderItem: this.renderErrorBar,
                encode: {
                    x: 0,
                    y: [1, 2]
                },
                data: varErrorData,
                z: 100
            });
        }

        return {
            animation: false,
            title: {
                text: this.service.getChartTitle(),
                left: 'center',
            },
            tooltip: {
                trigger: 'item',
                formatter: (params: any) => {
                    const values = (params as any).value;
                    const x = values[0] !== null ? values[0].toFixed(2) : 'N/A';
                    const y = values[1] !== null ? values[1].toFixed(2) : 'N/A';
                    const error = values.length > 2 && values[2] !== null ? `±${(values[2] - values[1]).toFixed(2)}` : '';
                    return `${params.seriesName}<br/>${this.service.getXAxisLabel()}: ${x}<br/>${this.service.getYAxisLabel()}: ${y} ${error}`;
                }
            },
            legend: {
                data: showVariable ? [dataLabel] : sourceLabels,
                top: 24,
            },
            grid: {
                left: GRID_LEFT,
                right: GRID_RIGHT,
                top: GRID_TOP,
                bottom: GRID_BOTTOM,
                containLabel: true
            },
            xAxis: {
                type: 'value',
                name: this.service.getXAxisLabel(),
                nameGap: 30,
                nameLocation: 'middle',
                min: extents.minX,
                max: extents.maxX,
                scale: true,
            },
            yAxis: {
                type: 'value',
                name: this.service.getYAxisLabel(),
                nameGap: 40, // Increased gap for Y-axis label
                nameLocation: 'middle',
                min: extents.minY,
                max: extents.maxY,
                scale: true,
                inverse: true // Inverted Y-axis as per Highcharts config
            },
            series: series as any[],
        };
    }

    private renderErrorBar(params: any, api: any) {
        const xValue = api.value(0);
        const highPoint = api.coord([xValue, api.value(1)]);
        const lowPoint = api.coord([xValue, api.value(2)]);
        const style = api.style({
            stroke: api.visual('color'),
            fill: undefined
        });

        return {
            type: 'group',
            children: [{
                type: 'line',
                shape: {
                    x1: highPoint[0], y1: highPoint[1],
                    x2: lowPoint[0], y2: lowPoint[1]
                },
                style: style
            }, {
                type: 'line',
                shape: {
                    x1: highPoint[0] - 2, y1: highPoint[1],
                    x2: highPoint[0] + 2, y2: highPoint[1]
                },
                style: style
            }, {
                type: 'line',
                shape: {
                    x1: lowPoint[0] - 2, y1: lowPoint[1],
                    x2: lowPoint[0] + 2, y2: lowPoint[1]
                },
                style: style
            }]
        };
    }

    private getAxisExtents(data: number[][]): { minX: number, maxX: number, minY: number, maxY: number } {
        if (data.length === 0) {
            return { minX: 0, maxX: 1, minY: 0, maxY: 1 };
        }

        let minX = Math.min(...data.map((point) => point[0]));
        let maxX = Math.max(...data.map((point) => point[0]));
        let minY = Math.min(...data.map((point) => point[1]));
        let maxY = Math.max(...data.map((point) => point[1]));

        const xPadding = (maxX - minX) * 0.05;
        const yPadding = (maxY - minY) * 0.05;

        minX -= xPadding;
        maxX += xPadding;
        minY -= yPadding;
        maxY += yPadding;

        if (minY === maxY) { minY -= 1; maxY += 1; }

        return {
            minX: parseFloat(minX.toPrecision(4)),
            maxX: parseFloat(maxX.toPrecision(4)),
            minY: parseFloat(minY.toPrecision(4)),
            maxY: parseFloat(maxY.toPrecision(4)),
        };
    }
}
