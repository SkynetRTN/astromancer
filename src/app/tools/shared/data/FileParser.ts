import {Subject} from "rxjs";

export interface MyFileParserStrategy {
  validateFormat(file: File): boolean;

  readFile(fileText: string, dataKeyMaps: { [key: string]: string }[]): {
    headers: { [key: string]: string } | undefined,
    data: any[] | undefined
  };
}

export class MyFileParser {
  private readonly strategy: MyFileParserStrategy;
  private readonly dataKeyMaps: { [key: string]: string }[];
  private headers: { [key: string]: string } | undefined;
  private data: any[] | undefined;
  private statusSubject: Subject<void> = new Subject<void>();
  /**
   * Observable to notify when the data is updated
   */
  public update$ = this.statusSubject.asObservable();

  /**
   * Construct a MyFileParser
   * @param fileType - The type of file to parse
   */
  constructor(fileType: FileType, dataKeyMaps: { [key: string]: string }[]) {
    if (fileType === FileType.TXT) {
      this.strategy = new MyFileParserTXT();
    } else {
      this.strategy = new MyFileParserDefault();
    }
    this.dataKeyMaps = dataKeyMaps;
  };


  /**
   * Validate the format of the file
   * @param file
   * @return true if the format is valid, false otherwise
   */
  public isFormatValid(file: File): boolean {
    return this.strategy.validateFormat(file);
  }

  /**
   * Load the file into the parser
   * @param file: File
   */
  public loadFile(file: File): void {
    if (!this.isFormatValid(file))
      throw new Error("Invalid file format");
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      const parsed = this.strategy.readFile(fileReader.result as string, this.dataKeyMaps);
      this.headers = parsed.headers;
      this.data = parsed.data;
      this.statusSubject.next();
    }
    fileReader.readAsText(file);
  }

  public getData(): any[] | undefined {
    return this.data;
  }

  public getHeaders(): { [key: string]: string } | undefined {
    return this.headers;
  }


}

export enum FileType {
  TXT = "txt",
}

class MyFileParserTXT implements MyFileParserStrategy {
  validateFormat(file: File): boolean {
    return (file.type.match("text/plain") as unknown as boolean || file.name.endsWith(".txt"))
      ? true : false;
  }

  readFile(fileText: string, dataKeyMaps: { [key: string]: string }[]): {
    headers: { [key: string]: string };
    data: any[]
  } {
    const lines = fileText.split("\n");
    const nonDataLines = lines.filter((line: string) => line.startsWith("#"));
    const headers: { [key: string]: string } = {};
    nonDataLines.filter((line: string) => line.includes("=")).map(
      (line: string): any => {
        headers[line.split("=")[0].replace("#", "").trim()] = line.split("=")[1].trim();
      });

    const cols: string[] = nonDataLines[nonDataLines.length - 1].replace("#", "").split(/\s+/).map((col: string) => col.trim()).filter((col: string) => col !== "");
    const dataKeyIndexMaps: { [key: string]: number } = {};
    const dataKeys: string[] = [];
    dataKeyMaps.forEach((dataKeyMap: { [key: string]: string }) => {
      dataKeys.push(Object.keys(dataKeyMap)[0]);
      dataKeyIndexMaps[Object.keys(dataKeyMap)[0]] = cols.indexOf(Object.values(dataKeyMap)[0]);
    });

    const resultData: any[] =[];
    lines.filter((line: string) => !line.startsWith("#")).map((line: string) => {
      const data: any = {};
      const values: string[] = line.split(/\s+/).map((value: string) => value.trim()).filter((value: string) => value !== "");
      const entry: any = {};
      dataKeys.forEach((dataKey: string) => {
        entry[dataKey] = values[dataKeyIndexMaps[dataKey]];
      });
      resultData.push(entry);
    });

    return {data: resultData, headers: headers};
  }
}

class MyFileParserDefault implements MyFileParserStrategy {
  validateFormat(file: File): boolean {
    return false;
  }

  readFile(fileText: string, dataKeyMaps: { [key: string]: string }[]): {
    headers: { [key: string]: string } | undefined;
    data: any[] | undefined
  } {
    return {data: undefined, headers: undefined}
  }
}
