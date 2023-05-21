import {
  Component,
  Directive,
  EventEmitter,
  Injector,
  Input,
  NgModule,
  OnInit,
  Type,
  ViewContainerRef
} from '@angular/core';
import {ChartAction} from "../types/actions";

/**
 * Interface for components that can be created by {@link ChartDirective}
 *
 */
export interface ChartComponent {
  /**
   * Observable that a chart subscribes for change to execute.
   */
  chartUpdateObs$: EventEmitter<ChartAction[]>;

  /**
   * Set title for a chart
   * @param title new title for the chart
   */
  setTitle(title: string): void;

  /**
   * Set x-axis lable for a chart
   * @param title new x-axis lable for the chart
   */
  setXAxis(title: string): void;

  /**
   * Set y-axis lable for a chart
   * @param title new y-axis lable for the chart
   */
  setYAxis(title: string): void;

  /**
   * Set display lable for data source
   * @param data name of the data source when chart was initialized
   * @param title new display lable for that data source
   */
  setDataLabel(data: string, title: string): void;

  /**
   * Hide data source
   * @param index index(indices) of data sources to be hidden
   */
  hideDataSet(index: number | number[]): void;

  /**
   * Show data source
   * @param index index(indices) of data sources to be shown
   */
  showDataSet(index: number | number[]): void;
}

/**
 * Directive for charts.
 *
 * Delcared in {@link ChartDirectiveModule}
 */
@Directive({
  selector: '[chart-directive]',
})
export class ChartDirective implements OnInit {
  @Input() chartType!: Type<Component>;
  @Input() chartUpdateObs$: EventEmitter<ChartAction[]>;

  constructor(private container: ViewContainerRef) {
    this.chartUpdateObs$ = new EventEmitter<ChartAction[]>();
  }

  ngOnInit(): void {
    const chartInjector: Injector = Injector.create(
      { providers: [{ provide: 'chartUpdateObs$', useValue: this.chartUpdateObs$ }] });
    this.container.createComponent(this.chartType, { injector: chartInjector });
  }

}

/**
 * Module encapsulating {@link ChartDirective}
 */
@NgModule({
  declarations: [ChartDirective],
  exports: [ChartDirective],
}
)
export class ChartDirectiveModule {
}
