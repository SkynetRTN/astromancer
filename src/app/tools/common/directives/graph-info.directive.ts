import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[graph-info]',
})
export class GraphInfoDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}
