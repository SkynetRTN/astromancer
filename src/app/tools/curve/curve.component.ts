import { AfterViewInit, Component, EventEmitter, } from '@angular/core';
import { StandardGraphInfoComponent } from "../shared/standard-graph-info/standard-graph-info.component";
import { LineFormComponent } from "./line-form/line-form.component";
import { SimpleTableImplComponent } from "../shared/tables/simple-table-impl/simple-table-impl.component";
import { SimpleTableInitArgs } from "../shared/tables/simpleTable";
import { SimpleDataButtonComponent } from "../shared/simple-data-button/simple-data-button.component";
import { CurveChartComponent } from "./curve-chart/curve-chart.component";
import { ChartAction, TableAction } from "../shared/types/actions";
import { StandardGraphInfo } from "../shared/standard-graph-info/standard-graphinfo";
import { SimpleGraphButtonComponent } from "../shared/simple-graph-button/simple-graph-button.component";
/**
 * Curve Component
 * 
 * The main component for the Curve graphing tool, declared in {@link CurveModule}.
 * 
 * Calls to StandardLayoutModule, 
 * plugging in {@link LineFormModule}, {@link SimpleDataButtonModule}, {@link SimpleTableImplModule}, 
 *  {@link CurveChartModule}, {@link SimpleGraphButtonModule}
 */
@Component({
  selector: 'app-curve',
  templateUrl: './curve.component.html',
  styleUrls: ['./curve.component.scss'],
})
export class CurveComponent implements AfterViewInit {
  /**
   * Type of component for {@link GraphInfoDirective}
   */
  graphInfoType: any;
  /**
   * Default chart information that would be used to initialize {@link graphInfoType}
   */
  defaultChartInfo: StandardGraphInfo;
  /**
   * Type of component for {@link DataControlDirective}
   */
  dataControlType: any;
  /**
   * Type of component for {@link DataButtonDirective}
   */
  dataButtonType: any;
  /**
   * Type of component for {@link DataTableDirective}
   */
  tableType: any;
  /**
   * Type of component for {@link ChartDirective}
   */
  chartType: any;
  /**
   * Observer that subsrcibes to interface command to execute actions on the table.
   */
  tableUpdateObserver$: EventEmitter<TableAction[]>;
  /**
   * Observer that subsrcibes to interface command to execute actions on the chart.
   */
  chartUpdateObserver$: EventEmitter<ChartAction[]>;
  graphButtonType: any;

  constructor() {
    this.graphInfoType = StandardGraphInfoComponent;
    this.defaultChartInfo = new StandardGraphInfo($localize`:title:Title`, $localize`y1, y2, y3, y4`, 'x', 'y');
    this.dataControlType = LineFormComponent;
    this.dataButtonType = SimpleDataButtonComponent;
    this.tableType = SimpleTableImplComponent;
    this.chartType = CurveChartComponent;
    this.graphButtonType = SimpleGraphButtonComponent;
    this.tableUpdateObserver$ = new EventEmitter<TableAction[]>();
    this.chartUpdateObserver$ = new EventEmitter<ChartAction[]>();
  }

  ngAfterViewInit(): void {
    this.tableUpdateObserver$.emit([{ action: 'observeTable' }]);
    this.tableUpdateObserver$.emit([{ action: 'plotData' }]);
  }

  defaultArgs(): SimpleTableInitArgs {
    const data: any[] = [
      { "x": 0, "y1": 25, "y2": '', "y3": '', "y4": '' },
      { "x": 1, "y1": 16, "y2": '', "y3": '', "y4": '' },
      { "x": 2, "y1": 9, "y2": '', "y3": '', "y4": '' },
      { "x": 3, "y1": 4, "y2": '', "y3": '', "y4": '' },
      { "x": 4, "y1": 1, "y2": '', "y3": '', "y4": '' },
      { "x": 5, "y1": 4, "y2": '', "y3": '', "y4": '' },
      { "x": 6, "y1": 9, "y2": '', "y3": '', "y4": '' },
      { "x": 7, "y1": 16, "y2": '', "y3": '', "y4": '' },
      { "x": 8, "y1": 25, "y2": '', "y3": '', "y4": '' },
      { "x": 9, "y1": 36, "y2": '', "y3": '', "y4": '' },
      { "x": '', "y1": '', 'y2': '', "y3": '', "y4": '' },
      { "x": '', "y1": '', 'y2': '', "y3": '', "y4": '' },
      { "x": '', "y1": '', 'y2': '', "y3": '', "y4": '' },
      { "x": '', "y1": '', 'y2': '', "y3": '', "y4": '' },
      { "x": '', "y1": '', 'y2': '', "y3": '', "y4": '' },
    ];
    const hiddenCols: number[] = [2, 3, 4];
    return { data: data, hiddenCols: hiddenCols };
  }

  onTableUserObs(actions: TableAction[]) {
    let tableCommands: TableAction[] = [];
    let chartCommands: ChartAction[] = [];
    for (let action of actions) {
      if (action.action == "addRow") {
        tableCommands.push({ action: 'addRow' });
      } else if (action.action == "curveNumChange") {
        tableCommands = tableCommands.concat(this.getHiddenColsCmd(action.payload));
        chartCommands = chartCommands.concat(this.getHiddenDataCmd(action.payload));
      } else if (action.action == "plotData") {
        chartCommands.push(action);
      }
    }
    if (tableCommands.length > 0) {
      this.tableUpdateObserver$.emit(tableCommands);
    }
    if (chartCommands.length > 0) {
      this.chartUpdateObserver$.emit(chartCommands);
    }
  }

  onChartUserObs(actions: ChartAction[]) {
    let cmds: ChartAction[] = [];
    for (let action of actions) {
      if (action.action == "flipY") {
        cmds.push(action);
      } else if (action.action == "updateLabels") {
        cmds = cmds.concat(action.payload.getChartLabelCmd(4));
      } else if (action.action == "saveGraph") {
        cmds.push(action);
      }
    }
    this.chartUpdateObserver$.emit(cmds);
  }

  private getHiddenColsCmd(numOfVariables: number): TableAction[] {
    let cmds: TableAction[] = [];
    const hiddenCols = this.getHiddenCols(numOfVariables);
    cmds.push({ action: 'showCols', payload: [0, 1, 2, 3, 4].filter(c => !hiddenCols.includes(c)) });
    cmds.push({ action: 'hideCols', payload: hiddenCols });
    return cmds;
  }

  private getHiddenDataCmd(numOfVariables: number): ChartAction[] {
    let cmds: ChartAction[] = [];
    const hiddenCols = this.getHiddenCols(numOfVariables).map(
      (e) => {
        return e - 1
      });
    cmds.push({ action: 'showDataSet', payload: [0, 1, 2, 3].filter(c => !hiddenCols.includes(c)) });
    cmds.push({ action: 'hideDataSet', payload: hiddenCols });
    return cmds;
  }

  private getHiddenCols(numOfVariables: number): number[] {
    let hiddenCols: number[] = [];
    const totalVariables: number = 4;
    for (let variable = numOfVariables; variable <= totalVariables - 1; variable++) {
      hiddenCols.push(variable + 1);
    }
    return hiddenCols;
  }
}

