import {Subject} from "rxjs";
import {HeaderRequirement, MyFileParserErrors, MyFileParserStrategy} from "./FileParser.util";

export class MyFileParserDefault implements MyFileParserStrategy {
  getData(fileText: string, fields: string[],
          fieldsIndices: { [value: string]: number }): any[] | undefined {
    return undefined;
  }

  getFieldsIndices(fileText: string, dataKeys: string[]): { [p: string]: number } | undefined {
    return undefined;
  }

  getHeaders(fileText: string, headerRequirements: HeaderRequirement[]): { [p: string]: string } | undefined {
    return undefined;
  }

  readFile(file: File, headerRequirements: HeaderRequirement[], dataKeys: string[],
           errorSubject: Subject<MyFileParserErrors>,
           dataSubject: Subject<any> | undefined,
           headerSubject: Subject<any> | undefined): void {
    errorSubject.next(MyFileParserErrors.STRATEGY);
  }

  validateFormat(file: File): boolean {
    return false;
  }

}
