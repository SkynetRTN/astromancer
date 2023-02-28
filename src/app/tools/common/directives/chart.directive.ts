import {Component, Directive, Input, OnInit, Type, ViewContainerRef} from '@angular/core';

@Directive({
  selector: '[Graph]',
})
export class ChartDirective implements OnInit {
  @Input() chartType!: Type<Component>;
  // @Output() tableObs$: EventEmitter<any>;

  constructor(private container: ViewContainerRef) {
    // this.tableObs$ = new EventEmitter<any>();
  }

  ngOnInit(): void {
    this.container.createComponent(this.chartType);
    // (component.instance as any).tableObs$.subscribe(this.tableObs$);
  }

}
