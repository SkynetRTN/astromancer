import {Component, EventEmitter, OnInit} from '@angular/core';
import {StandardGraphInfoComponent} from "../common/standard-graph-info/standard-graph-info.component";
import {LineFormComponent} from "./line-form/line-form.component";
import {SimpleTableImplComponent} from "../common/tables/simple-table-impl/simple-table-impl.component";
import {SimpleTableInitArgs} from "../common/tables/simpleTable";
import {SimpleDataButtonComponent} from "../common/simple-data-button/simple-data-button.component";
import {CurveChartComponent} from "./curve-chart/curve-chart.component";
import {ChartAction, TableAction} from "../common/types/actions";

@Component({
  selector: 'app-curve',
  templateUrl: './curve.component.html',
  styleUrls: ['./curve.component.css'],
})
export class CurveComponent implements OnInit {
  graphInfoType: any;
  dataControlType: any;
  dataButtonType: any;
  tableType: any;
  chartType: any;
  tableUpdateObserver$: EventEmitter<TableAction[]>;
  chartUpdateObserver$: EventEmitter<ChartAction[]>;

  constructor() {
    this.graphInfoType = StandardGraphInfoComponent;
    this.dataControlType = LineFormComponent;
    this.dataButtonType = SimpleDataButtonComponent;
    this.tableType = SimpleTableImplComponent;
    this.chartType = CurveChartComponent;
    this.tableUpdateObserver$ = new EventEmitter<TableAction[]>();
    this.chartUpdateObserver$ = new EventEmitter<ChartAction[]>();

  }

  ngOnInit(): void {
  }

  defaultArgs(): SimpleTableInitArgs {
    const data: any[] = [
      {"x": 0, "y1": 25, "y2": '', "y3": '', "y4": ''},
      {"x": 1, "y1": 16, "y2": '', "y3": '', "y4": ''},
      {"x": 2, "y1": 9, "y2": '', "y3": '', "y4": ''},
      {"x": 3, "y1": 4, "y2": '', "y3": '', "y4": ''},
      {"x": 4, "y1": 1, "y2": '', "y3": '', "y4": ''},
      {"x": 5, "y1": 4, "y2": '', "y3": '', "y4": ''},
      {"x": 6, "y1": 9, "y2": '', "y3": '', "y4": ''},
      {"x": 7, "y1": 16, "y2": '', "y3": '', "y4": ''},
      {"x": 8, "y1": 25, "y2": '', "y3": '', "y4": ''},
      {"x": 9, "y1": 36, "y2": '', "y3": '', "y4": ''},
      {"x": '', "y1": '', 'y2': '', "y3": '', "y4": ''},
      {"x": '', "y1": '', 'y2': '', "y3": '', "y4": ''},
      {"x": '', "y1": '', 'y2': '', "y3": '', "y4": ''},
      {"x": '', "y1": '', 'y2': '', "y3": '', "y4": ''},
      {"x": '', "y1": '', 'y2': '', "y3": '', "y4": ''},
    ];
    const hiddenCols: number[] = [2, 3, 4];
    return {data: data, hiddenCols: hiddenCols};
  }

  tableObs(actions: TableAction[]) {
    let cmds: TableAction[] = [];
    for (let action of actions){
      if (action.action == "addRow"){
        cmds.push({action: 'addRow'});
      } else if (action.action == "curveNumChange"){
        cmds = cmds.concat(this.getHiddenCols(action.payload));
      }
    }
    this.tableUpdateObserver$.emit(cmds);
  }

  chartObs(actions: ChartAction[]) {
    let cmds: ChartAction[] = [];
    for (let action of actions) {
      if (action.action == "flipY"){
        cmds.push(action)
      }
    }
    this.chartUpdateObserver$.emit(cmds);
  }

  private getHiddenCols(numOfVariables: number): TableAction[] {
    let cmds: TableAction[] = [];
    let hiddenCols: number[] = [];
    const totalVariables: number = 4;
    for (let variable = numOfVariables; variable <= totalVariables - 1; variable++) {
      hiddenCols.push(variable + 1);
    }
    cmds.push({action: 'showCols', payload: [0,1,2,3,4].filter(c => !hiddenCols.includes(c))});
    cmds.push({action: 'hideCols', payload: hiddenCols});
    return cmds;
  }
}

