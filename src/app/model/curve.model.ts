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
      {x: null, y1: null, y2: null, y3: null, y4: null},
      {x: null, y1: null, y2: null, y3: null, y4: null},
      {x: null, y1: null, y2: null, y3: null, y4: null},
      {x: null, y1: null, y2: null, y3: null, y4: null},
      {x: null, y1: null, y2: null, y3: null, y4: null},
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

  public setDataByCell(value: number | null, row: number, col: string): void {
    switch (col) {
      case CurveParam.X:
        this.curveDataDict[row][CurveParam.X] = value;
        break;
      case CurveParam.Y1:
        this.curveDataDict[row][CurveParam.Y1] = value;
        break;
      case CurveParam.Y2:
        this.curveDataDict[row][CurveParam.Y2] = value;
        break;
      case CurveParam.Y3:
        this.curveDataDict[row][CurveParam.Y3] = value;
        break;
      case CurveParam.Y4:
        this.curveDataDict[row][CurveParam.Y4] = value;
        break;
    }
  }

  getDataKeys(curveCount: number): string[] {
    let result = ["x", "y1"];
    if (curveCount >= CurveCounts.TWO) {
      result.push("y2");
    }
    if (curveCount >= CurveCounts.THREE) {
      result.push("y3");
    }
    if (curveCount >= CurveCounts.FOUR) {
      result.push("y4");
    }
    return result;
  }

  addRow(index: number, amount: number) {
    if (index > 0) {
      for (let i = 0; i < amount; i++) {
        this.curveDataDict.splice(index + i, 0, {x: null, y1: null, y2: null, y3: null, y4: null});
      }
    } else
      this.curveDataDict.push({x: null, y1: null, y2: null, y3: null, y4: null});
  }

  removeRow(index: number, amount: number) {
    this.curveDataDict = this.curveDataDict.slice(0, index).concat(this.curveDataDict.slice(index + amount));
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
  X = 'x',
  Y1 = 'y1',
  Y2 = 'y2',
  Y3 = 'y3',
  Y4 = 'y4'
}

export enum CurveCounts {
  ONE = 1,
  TWO = 2,
  THREE = 3,
  FOUR = 4
}

export interface CurveObservable {
  update(): void;
}
