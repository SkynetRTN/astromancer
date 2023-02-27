import {Component, Injector, Input, OnInit, Type, ViewChild} from '@angular/core';
import {GraphInfoDirective} from "../directives/graph-info.directive";
import {DataControlDirective} from "../directives/data-control.directive";
import {DataTableDirective} from "../directives/data-table.directive";
import {SimpleTableImplArgs} from "../tables/simple-table-impl/simple-table-impl.component";

@Component({
  selector: 'app-standard-layout',
  templateUrl: './standard-layout.component.html',
  styleUrls: ['./standard-layout.component.css']
})
export class StandardLayoutComponent implements OnInit {
  @Input() graphInfoType!: Type<Component>
  @Input() dataControlType!: Type<Component>
  @Input() tableType!: Type<Component>
  @Input() defaultTableArgs!: SimpleTableImplArgs;
  @ViewChild(GraphInfoDirective, {static: true}) graphInfo!: GraphInfoDirective;
  @ViewChild(DataControlDirective, {static: true}) dataControl!: DataControlDirective;
  @ViewChild(DataTableDirective, {static: true}) dataTableDir!: DataTableDirective;

  constructor() {
  }

  ngOnInit(): void {
    this.loadComponent();
  }

  loadComponent() {
    this.graphInfo.viewContainerRef.createComponent(this.graphInfoType);
    this.dataControl.viewContainerRef.createComponent(this.dataControlType);
    const tableInjector: Injector = Injector.create({
      providers: [{
        provide: 'tableArgs',
        useValue: this.defaultTableArgs
      }]
    });
    this.dataTableDir.viewContainerRef.createComponent(this.tableType, {injector: tableInjector});
  }
}
