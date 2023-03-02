import {Component, EventEmitter, Input, Output, Type, ViewChild} from '@angular/core';
import {GraphInfoDirective} from "../directives/graph-info.directive";
import {DataControlDirective} from "../directives/data-control.directive";
import {DataTableDirective} from "../directives/data-table.directive";
import {SimpleTableInitArgs} from "../tables/simpleTable";
import {DataButtonDirective} from "../directives/data-button.directive";
import {ChartAction, TableAction} from "../types/actions";
import {StandardGraphInfo} from "../standard-graph-info/standard-graphinfo";

@Component({
  selector: 'app-standard-layout',
  templateUrl: './standard-layout.component.html',
  styleUrls: ['./standard-layout.component.css']
})
export class StandardLayoutComponent {
  @Input() graphInfoType!: Type<Component>;
  @Input() defaultChartInfo!: StandardGraphInfo;
  @Input() dataControlType!: Type<Component>;
  @Input() dataButtonType!: Type<Component>;
  @Input() tableType!: Type<Component>;
  @Input() chartUpdateObs$: EventEmitter<ChartAction[]>;
  @Input() tableUpdateObs$: EventEmitter<TableAction[]>;
  @Input() defaultTableArgs!: SimpleTableInitArgs;
  @Input() chartType!: Type<Component>;
  @Input() graphButtonType!: Type<Component>;
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
    this.chartUpdateObs$ = new EventEmitter<ChartAction[]>();
  }

  onTableUserAction(actions: TableAction[]) {
    this.tableUserActionObs$.emit(actions);
  }

  onChartUserAction(actions: ChartAction[]) {
    this.chartUserActionObs$.emit(actions);
  }
}
