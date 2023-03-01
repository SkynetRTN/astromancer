import {ChartAction} from "../types/actions";

export class StandardGraphInfo {

  constructor(
    public title: string,
    public data: string,
    public xAxis: string,
    public yAxis: string,
  ) {
  }
  getChartLabelCmd(maxYs: number): ChartAction[] {
    let cmds: ChartAction[] = [];
    cmds.push({action: "setTitle", payload: this.title});
    cmds.push({action: "setXAxis", payload: this.xAxis});
    cmds.push({action: "setYAxis", payload: this.yAxis});
    let dataTitles: string[] = this.data.split(",");
    for (let i = 0; i < dataTitles.length && i < maxYs; i++) {
      cmds.push({action: "setData" + (i + 1), payload: dataTitles[i].replace(' ', '')});
    }
    return cmds;
  }
}
