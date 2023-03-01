import {Component, Directive, EventEmitter, Injector, Input, OnInit, Type, ViewContainerRef} from '@angular/core';
import {ChartAction} from "../types/actions";

export interface ChartComponent{
  chartUpdateObs$: EventEmitter<ChartAction[]>;
}

@Directive({
  selector: '[Graph]',
})
export class ChartDirective implements OnInit {
  @Input() chartType!: Type<Component>;
  @Input() chartUpdateObs$: EventEmitter<ChartAction[]>;

  constructor(private container: ViewContainerRef) {
    this.chartUpdateObs$ = new EventEmitter<ChartAction[]>();
  }

  ngOnInit(): void {
    const chartInjector: Injector = Injector.create(
      {providers: [{provide: 'chartUpdateObs$', useValue: this.chartUpdateObs$}]});
    this.container.createComponent(this.chartType, {injector: chartInjector});
  }

}
