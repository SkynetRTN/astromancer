import {Component, EventEmitter, Input, OnInit, Output, Type, ViewChild} from '@angular/core';
import {GraphInfoDirective} from "../directives/graph-info.directive";
import {DataControlDirective} from "../directives/data-control.directive";
import {DataTableDirective} from "../directives/data-table.directive";
import {SimpleTableInitArgs} from "../tables/simpleTable";
import {DataButtonDirective} from "../directives/data-button.directive";
import {ChartAction, TableAction} from "../types/actions";

@Component({
  selector: 'app-standard-layout',
  templateUrl: './standard-layout.component.html',
  styleUrls: ['./standard-layout.component.css']
})
export class StandardLayoutComponent implements OnInit {
  @Input() graphInfoType!: Type<Component>;
  @Input() dataControlType!: Type<Component>;
  @Input() dataButtonType!: Type<Component>;
  @Input() tableType!: Type<Component>;
  @Input() tableUpdateObs$: EventEmitter<TableAction[]>;
  @Input() defaultTableArgs!: SimpleTableInitArgs;
  @Input() chartType!: Type<Component>;
  @Output() tableUserActionObs$: EventEmitter<TableAction[]>;
  @Output() chartUserActionObs$: EventEmitter<ChartAction[]>;
  @ViewChild(GraphInfoDirective, {static: true}) graphInfo!: GraphInfoDirective;
  @ViewChild(DataControlDirective, {static: true}) dataControl!: DataControlDirective;
  @ViewChild(DataTableDirective, {static: true}) dataTableDir!: DataTableDirective;
  @ViewChild(DataButtonDirective, {static: true}) dataButtonDir!: DataButtonDirective;


  constructor() {
    this.tableUserActionObs$ = new EventEmitter<TableAction[]>();
    this.chartUserActionObs$ = new EventEmitter<ChartAction[]>();
    this.tableUpdateObs$ = new EventEmitter<TableAction[]>();
  }

  ngOnInit(): void {
    this.loadComponent();
  }

  loadComponent() {
    this.graphInfo.viewContainerRef.createComponent(this.graphInfoType);
  }

  onTableUserAction(actions: TableAction[]) {
    this.tableUserActionObs$.emit(actions);
  }

  onChartUserAction(actions: ChartAction[]) {
    this.chartUserActionObs$.emit(actions);
  }
}
