import {Directive, ViewContainerRef} from '@angular/core';

@Directive({
  selector: '[data-control]',
})
export class DataControlDirective {
  constructor(public viewContainerRef: ViewContainerRef) {
  }
}
