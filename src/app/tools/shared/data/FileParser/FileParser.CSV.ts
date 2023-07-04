import {HeaderRequirement, MyFileParserErrors, MyFileParserStrategy} from "./FileParser.util";
import {Subject} from "rxjs";

export class MyFileParserCSV implements MyFileParserStrategy {
  getData(fileText: string,
          fields: string[],
          fieldsIndices: { [p: string]: number }): any[] | undefined {
    if (fields.length === 0 || (fields.length !== Object.keys(fieldsIndices).length)) {
      return undefined;
    }

    const resultData: any[] = [];
    fileText.split("\n").slice(1)
      .map((line: string) => {
        const data: any = {};
        const values: string[] = line.split(',')
          .map((value: string) => value.trim());
        fields.forEach((field: string) => {
          data[field] = values[fieldsIndices[field]];
        });
        resultData.push(data);
      });
    return resultData;
  }

  getFieldsIndices(fileText: string, dataKeys: string[])
    : { [p: string]: number } | undefined {
    const cols = fileText.split("\n")[0]
      .split(",")
      .map((value: string) => value.trim());
    const keyFieldMap: { [key: string]: number } = {};
    let isDataKeyMissing: boolean = false;

    dataKeys.forEach((dataKey: string) => {
      keyFieldMap[dataKey] = cols.indexOf(dataKey);
      if (keyFieldMap[dataKey] === -1) {
        isDataKeyMissing = true;
      }
    });
    return isDataKeyMissing ? undefined : keyFieldMap;
  }

  getHeaders(fileText: string, headerRequirements: HeaderRequirement[])
    : { [p: string]: string } | undefined {
    return undefined;
  }

  readFile(file: File, headerRequirements: HeaderRequirement[], dataKeys: string[],
           errorSubject: Subject<MyFileParserErrors>,
           dataSubject: Subject<any> | undefined,
           headerSubject: Subject<any> | undefined): void {
    if (!this.validateFormat(file)) {
      errorSubject.next(MyFileParserErrors.FORMAT);
      return;
    }

    const fileReader = new FileReader();
    fileReader.onload = () => {
      const fileText = fileReader.result as string;
      const fieldsIndices = this.getFieldsIndices(fileText, dataKeys);
      if (fieldsIndices === undefined) {
        errorSubject.next(MyFileParserErrors.FIELD);
        return;
      }

      const data = this.getData(fileText, dataKeys, fieldsIndices);
      if (data === undefined) {
        errorSubject.next(MyFileParserErrors.DATA);
        return;
      }
      if (dataSubject !== undefined) {
        dataSubject.next(data);
      }
    }
    fileReader.readAsText(file);
  }

  validateFormat(file: File): boolean {
    return !(!file.type.match("(text/csv|application/vnd.ms-excel)")
      && !file.name.match(".*\.csv"));
  }
}
