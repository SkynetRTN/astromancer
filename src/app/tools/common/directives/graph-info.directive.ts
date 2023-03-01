import {Component, Directive, EventEmitter, Input, OnInit, Output, Type, ViewContainerRef} from '@angular/core';
import {ChartAction} from "../types/actions";
import {DataControlComponent} from "./data-control.directive";

export interface GraphInfoComponent{
  chartUserActionObs$: EventEmitter<ChartAction[]>;
}
@Directive({
  selector: '[GraphInfo]',
})
export class GraphInfoDirective implements OnInit{
  @Input() graphInfoType!: Type<Component>;
  @Output() chartUserActionObs$: EventEmitter<ChartAction[]>;
  constructor(public container: ViewContainerRef) {
    this.chartUserActionObs$ = new EventEmitter<ChartAction[]>();
  }

  ngOnInit(): void {
    const component = this.container.createComponent(this.graphInfoType);
    (component.instance as DataControlComponent).chartUserActionObs$.subscribe(this.chartUserActionObs$);
  }
}
