import {
  DataKey,
  getFieldsIndicesFromCols,
  HeaderRequirement,
  MyFileParserErrors,
  MyFileParserStrategy
} from "./FileParser.util";
import {Subject} from "rxjs";

export class MyFileParserCSV implements MyFileParserStrategy {
  /**
   * Split a CSV line into trimmed values, honoring double-quoted values that contain commas
   * @param line
   */
  static splitLine(line: string): string[] {
    const values: string[] = [];
    let value = "";
    let isQuoted = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (isQuoted && line[i + 1] === '"') {
          value += '"';
          i++;
        } else {
          isQuoted = !isQuoted;
        }
      } else if (char === ',' && !isQuoted) {
        values.push(value.trim());
        value = "";
      } else {
        value += char;
      }
    }
    values.push(value.trim());
    return values;
  }

  getData(fileText: string,
          fields: string[],
          fieldsIndices: { [p: string]: number }): any[] | undefined {
    if (fields.length === 0 || (fields.length !== Object.keys(fieldsIndices).length)) {
      return undefined;
    }

    const resultData: any[] = [];
    fileText.split("\n").slice(1)
      .filter((line: string) => line.trim() !== "")
      .map((line: string) => {
        const data: any = {};
        const values: string[] = MyFileParserCSV.splitLine(line);
        fields.forEach((field: string) => {
          data[field] = values[fieldsIndices[field]];
        });
        resultData.push(data);
      });
    return resultData;
  }

  getFieldsIndices(fileText: string, dataKeys: DataKey[], optionalDataKeys: DataKey[] = [])
    : { [p: string]: number } | undefined {
    const cols = MyFileParserCSV.splitLine(fileText.split("\n")[0]);
    return getFieldsIndicesFromCols(cols, dataKeys, optionalDataKeys);
  }

  getHeaders(fileText: string, headerRequirements: HeaderRequirement[])
    : { [p: string]: string } | undefined {
    return undefined;
  }

  readFile(file: File, headerRequirements: HeaderRequirement[], dataKeys: DataKey[],
           optionalDataKeys: DataKey[],
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
      const fieldsIndices = this.getFieldsIndices(fileText, dataKeys, optionalDataKeys);
      if (fieldsIndices === undefined) {
        errorSubject.next(MyFileParserErrors.FIELD);
        return;
      }

      const data = this.getData(fileText, Object.keys(fieldsIndices), fieldsIndices);
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
