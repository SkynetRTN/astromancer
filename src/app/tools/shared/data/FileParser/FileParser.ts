import {Subject} from "rxjs";
import {FileType, HeaderRequirement, MyFileParserErrors, MyFileParserStrategy} from "./FileParser.util";
import {MyFileParserTXT} from "./FileParser.TXT";
import {MyFileParserDefault} from "./FileParser.Default";
import {MyFileParserCSV} from "./FileParser.CSV";
import { MyFileParserTXTGW } from "./-deprecated-FileParser.TXTGW";
import { MyFileParserHDF5 } from "./-deprecated-FileParser.HDF5";
import { HttpClient } from "@angular/common/http";
import {MyFileParserFITS} from "./FileParser.FITS";


export class MyFileParser {
  private readonly strategy!: MyFileParserStrategy;
  private readonly headerRequirements: HeaderRequirement[];
  private readonly dataKeys: string[];

  private progressSubject: Subject<number> = new Subject<number>();
  public progress$ = this.progressSubject.asObservable();
  private errorSubject: Subject<MyFileParserErrors> = new Subject<MyFileParserErrors>();
  public error$ = this.errorSubject.asObservable();
  private headerSubject: Subject<{ [key: string]: string } | undefined>
    = new Subject<{ [key: string]: string } | undefined>();
  public header$ = this.headerSubject.asObservable();
  private dataSubject: Subject<any> = new Subject<any>();
  public data$ = this.dataSubject.asObservable();
  
  constructor(fileType: FileType,
              dataKeys: string[],
              headerRequirements: HeaderRequirement[] = [],
              httpClient?: HttpClient) {
    if (fileType === FileType.TXT) {
      this.strategy = new MyFileParserTXT();
    } else if (fileType === FileType.TXTGW) {
      this.strategy = new MyFileParserTXTGW();
    } else if (fileType === FileType.CSV) {
      this.strategy = new MyFileParserCSV();
    } else if (fileType === FileType.GWF && httpClient) {
      this.strategy = new MyFileParserHDF5(httpClient);
    } else if (fileType === FileType.FITS) {
      this.strategy = new MyFileParserFITS();
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
   * @param callBack
   */
  public getHeaders(file: File, isEmitError: boolean = false,
                    callBack?: (headers: { [key: string]: string },
                                errorSubject: Subject<MyFileParserErrors>) => void)
    : void {
    if (this.validateFormat(file)) {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        const fileText = fileReader.result as string;
        const headers = this.strategy.getHeaders(fileText, this.headerRequirements);
        if (headers === undefined && isEmitError) {
          this.errorSubject.next(MyFileParserErrors.HEADER);
        } else {
          this.headerSubject.next(headers);
          if (callBack) {
            callBack(headers as { [key: string]: string }, this.errorSubject);
          }
        }
      }
      fileReader.readAsText(file);
    }
  }

  /**
   * Read a file, with options weather to emit the data, headers, and/or progress alerts
   * @param file
   * @param isEmitData
   * @param isEmitHeaders
   * @param isEmitProgress
   */
  public readFile(file: File, isEmitData: boolean = true, isEmitHeaders: boolean = false, isEmitProgress: boolean = false): void {
    this.strategy.readFile(file, this.headerRequirements, this.dataKeys, this.errorSubject,
      isEmitData ? this.dataSubject : undefined,
      isEmitHeaders ? this.headerSubject : undefined,
      isEmitProgress ? this.progressSubject : undefined );
  }


}

