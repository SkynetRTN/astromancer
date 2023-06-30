import {Subject} from "rxjs";


export enum MyFileParserErrors {
  FORMAT = "format",
  FIELD = "field",
  HEADER = "header",
  DATA = "data",
  STRATEGY = "strategy",
}

export interface HeaderRequirement {
  key: string;
  value?: string;
}

export interface MyFileParserStrategy {
  /**
   * Validate the format of the file
   * @param file
   * @return true if the format is valid, false otherwise
   */
  validateFormat(file: File): boolean;

  /**
   * Get the headers of the file as a dictionary
   * @param fileText
   * @param headerRequirements
   * @return the headers of the file as a dictionary or undefined if the headers are not found
   */
  getHeaders(fileText: string,
             headerRequirements: HeaderRequirement[])
    : { [key: string]: string } | undefined;

  /**
   * Get the indices of the fields in the file
   * Emits an error if one or more fields are not found
   * @param fileText
   * @param dataKeys
   * @return the indices of the fields in the file or undefined if one or more fields are not found
   */
  getFieldsIndices(fileText: string,
                   dataKeys: string[])
    : { [key: string]: number } | undefined;

  /**
   * Get the data from the file
   * Emits an error if the data is invalid
   * Emits the data if the data is valid
   * @param fileText
   * @param fields
   * @param fieldsIndices
   * @return the data from the file or undefined if the data is invalid
   */
  getData(fileText: string,
          fields: string[],
          fieldsIndices: { [key: string]: number },)
    : any[] | undefined;

  /**
   * Read the file
   * Emits an error if the file is invalid
   * Emits the data if the file is valid
   * @param file
   * @param headerRequirements
   * @param dataKeys
   * @param errorSubject
   * @param dataSubject
   * @param headerSubject
   */
  readFile(file: File,
           headerRequirements: HeaderRequirement[],
           dataKeys: string[],
           errorSubject: Subject<MyFileParserErrors>,
           dataSubject: Subject<any> | undefined,
           headerSubject: Subject<any> | undefined): void;
}

export class MyFileParser {
  private readonly strategy!: MyFileParserStrategy;
  private readonly headerRequirements: HeaderRequirement[];
  private readonly dataKeys: string[];

  private errorSubject: Subject<MyFileParserErrors> = new Subject<MyFileParserErrors>();
  public error$ = this.errorSubject.asObservable();
  private headerSubject: Subject<{ [key: string]: string } | undefined>
    = new Subject<{ [key: string]: string } | undefined>();
  public header$ = this.headerSubject.asObservable();
  private dataSubject: Subject<any> = new Subject<any>();
  public data$ = this.dataSubject.asObservable();

  constructor(fileType: FileType,
              dataKeys: string[],
              headerRequirements: HeaderRequirement[] = [],) {
    if (fileType === FileType.GBO_SPECTRUM_TXT) {
      this.strategy = new MyFileParserTXT();
    } else {
      this.strategy = new MyFileParserDefault();
    }
    this.headerRequirements = headerRequirements;
    this.dataKeys = dataKeys;
  }

  /**
   * Validate the format of a file
   * @param file
   * @return true if the format is valid, false otherwise
   */
  public validateFormat(file: File): boolean {
    return this.strategy.validateFormat(file);
  }

  /**
   * Get the headers of a file as a dictionary
   * Emit the headers if the headers are found
   * @param file
   * @param isEmitError
   */
  public getHeaders(file: File, isEmitError: false): void {
    if (this.validateFormat(file)) {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        const fileText = fileReader.result as string;
        const headers = this.strategy.getHeaders(fileText, this.headerRequirements);
        if (headers === undefined && isEmitError) {
          this.errorSubject.next(MyFileParserErrors.HEADER);
        } else {
          this.headerSubject.next(headers);
        }
      }
      fileReader.readAsText(file);
    }
  }

  /**
   * Read a file, with options weather to emit the data and/or the headers
   * @param file
   * @param isEmitData
   * @param isEmitHeaders
   */
  public readFile(file: File, isEmitData: boolean = true, isEmitHeaders: boolean = false): void {
    this.strategy.readFile(file, this.headerRequirements, this.dataKeys, this.errorSubject,
      isEmitData ? this.dataSubject : undefined,
      isEmitHeaders ? this.headerSubject : undefined);
  }


}

export enum FileType {
  GBO_SPECTRUM_TXT = "gbo-spectrum-txt",
}


class MyFileParserTXT implements MyFileParserStrategy {
  getData(fileText: string,
          fields: string[],
          fieldsIndices: { [p: string]: number }): any[] | undefined {
    if (fields.length === 0 || (fields.length !== Object.keys(fieldsIndices).length)) {
      return undefined;
    }

    const resultData: any[] = [];
    fileText.split("\n").filter((line: string) => !line.startsWith("#"))
      .map((line: string) => {
        const data: any = {};
        const values: string[] = line.split(/\s+/)
          .map((value: string) => value.trim())
          .filter((value: string) => value !== "");
        fields.forEach((field: string) => {
          data[field] = values[fieldsIndices[field]];
        });
        resultData.push(data);
      });
    return resultData;
  }

  getFieldsIndices(fileText: string, dataKeys: string[])
    : { [p: string]: number } | undefined {
    const lines = fileText.split("\n");
    const nonDataLines = lines.filter((line: string) => line.startsWith("#"));
    const cols: string[] = nonDataLines[nonDataLines.length - 1]
      .replace("#", "").split(/\s+/)
      .map((col: string) => col.trim()).filter((col: string) => col !== "");
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
    const lines = fileText.split("\n");
    const headerLines = lines.filter((line: string) => line.startsWith("#") && line.includes("="));
    const headers: { [key: string]: string } = {};
    headerLines.map((line: string): any => {
      headers[line.split("=")[0].replace("#", "").trim()]
        = line.split("=")[1].trim();
    });

    const headerKeys = Object.keys(headers);
    let isHeaderValid = true;
    headerRequirements.forEach((headerRequirement: HeaderRequirement) => {
      if (!headerKeys.includes(headerRequirement.key) ||
        (headerRequirement.value !== undefined &&
          headers[headerRequirement.key] !== headerRequirement.value)) {
        isHeaderValid = false;
      }
    });
    return isHeaderValid ? headers : undefined;
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
      const headers = this.getHeaders(fileText, headerRequirements);
      if (headers === undefined) {
        errorSubject.next(MyFileParserErrors.HEADER);
        return;
      }
      if (headerSubject !== undefined) {
        headerSubject.next(headers);
      }
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
    return !(!file.type.match("text/plain") || !file.name.endsWith(".txt"));
  }
}

class MyFileParserDefault implements MyFileParserStrategy {
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
