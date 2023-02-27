import {Directive, ViewContainerRef} from '@angular/core';

@Directive({
  selector: '[DataTable]'
})
export class DataTableDirective {

  constructor(public viewContainerRef: ViewContainerRef) {
  }

}
