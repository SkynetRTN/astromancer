import {Component, Directive, EventEmitter, Input, OnInit, Output, Type, ViewContainerRef} from '@angular/core';

@Directive({
  selector: '[DataControl]',
})
export class DataControlDirective implements OnInit {
  @Input() controlType!: Type<Component>;
  @Output() tableObs$: EventEmitter<any>;

  constructor(private container: ViewContainerRef) {
    this.tableObs$ = new EventEmitter<any>();
  }

  ngOnInit(): void {
    const component = this.container.createComponent(this.controlType);
    (component.instance as any).tableObs$.subscribe(this.tableObs$);
  }

}
