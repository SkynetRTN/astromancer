export class CurveData {
  private curveDataDict: CurveDataDict[];

  constructor() {
    this.curveDataDict = [
      {x: 0, y1: 25, y2: null, y3: null, y4: null},
      {x: 1, y1: 16, y2: null, y3: null, y4: null},
      {x: 2, y1: 9, y2: null, y3: null, y4: null},
      {x: 3, y1: 4, y2: null, y3: null, y4: null},
      {x: 4, y1: 1, y2: null, y3: null, y4: null},
      {x: 5, y1: 4, y2: null, y3: null, y4: null},
      {x: 6, y1: 9, y2: null, y3: null, y4: null},
      {x: 7, y1: 16, y2: null, y3: null, y4: null},
      {x: 8, y1: 25, y2: null, y3: null, y4: null},
      {x: 9, y1: 36, y2: null, y3: null, y4: null},
    ];
  }

  public getData(curveCount: number): CurveDataDict[] {
    let result: CurveDataDict[] = [];
    for (const entry of this.curveDataDict) {
      let row: CurveDataDict = {x: entry.x, y1: entry.y1};
      if (curveCount >= CurveCounts.TWO) {
        row.y2 = entry.y2;
      }
      if (curveCount >= CurveCounts.THREE) {
        row.y3 = entry.y3;
      }
      if (curveCount >= CurveCounts.FOUR) {
        row.y4 = entry.y4;
      }
      result.push(row);
    }
    return result;
  }

  public setData(data: CurveDataDict[]): void {
    this.curveDataDict = data;
  }

  public setDataByCell(value: number|null, row: number, col: CurveParam): void {
    switch (col) {
      case CurveParam.X:
        this.curveDataDict[row].x = value;
        break;
      case CurveParam.Y1:
        this.curveDataDict[row].y1 = value;
        break;
      case CurveParam.Y2:
        this.curveDataDict[row].y2 = value;
        break;
      case CurveParam.Y3:
        this.curveDataDict[row].y3 = value;
        break;
      case CurveParam.Y4:
        this.curveDataDict[row].y4 = value;
        break;
    }
  }

}

export interface CurveDataDict {
  x: number | null;
  y1: number | null;
  y2?: number | null;
  y3?: number | null;
  y4?: number | null;
}

export enum CurveParam {
  X = 0,
  Y1 = 1,
  Y2 = 2,
  Y3 = 3,
  Y4 = 4
}

export enum CurveCounts {
  ONE = 1,
  TWO = 2,
  THREE = 3,
  FOUR = 4
}
