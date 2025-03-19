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
  getHeaders(fileText: string | object,
             headerRequirements: HeaderRequirement[])
    : { [key: string]: string } | undefined;

  /**
   * Get the indices of the fields in the file
   * Emits an error if one or more fields are not found
   * @param fileText
   * @param dataKeys
   * @return the indices of the fields in the file or undefined if one or more fields are not found
   */
  getFieldsIndices(fileText: string | object,
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
  getData(fileText: string | object,
          fields: string[],
          fieldsIndices: { [key: string]: number },)
    : any[] | undefined;

  /**
   * Read the file
   * Emits an error if the file is invalid
   * Emits the data if the file is valid
   * Emits progress notifications during upload/file reading
   * @param file
   * @param headerRequirements
   * @param dataKeys
   * @param errorSubject
   * @param dataSubject
   * @param headerSubject
   * @param progressSubject
   */
  readFile(file: File,
           headerRequirements: HeaderRequirement[],
           dataKeys: string[],
           errorSubject: Subject<MyFileParserErrors>,
           dataSubject: Subject<any> | undefined,
           headerSubject: Subject<any> | undefined,
           progressSubject: Subject<any> | undefined): void;
}

export enum FileType {
  TXT = "txt",
  TXTGW = "txtgw",
  CSV = "csv",
  GWF = "gwf",
  FITS = "fits"
}

