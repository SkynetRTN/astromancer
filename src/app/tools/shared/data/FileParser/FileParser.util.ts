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

/**
 * A column to look up in a file.
 * A string is a single column name; an array lists alternative names for the same column,
 * and the first one present in the file is used. Data is keyed by the column name found.
 */
export type DataKey = string | string[];

/**
 * Map data keys to the indices of their columns
 * @param cols the column names of the file
 * @param dataKeys keys that must be present
 * @param optionalDataKeys keys that are skipped if absent
 * @return the indices keyed by the column name found, or undefined if a required key is missing
 */
export function getFieldsIndicesFromCols(cols: string[],
                                         dataKeys: DataKey[],
                                         optionalDataKeys: DataKey[] = [])
  : { [key: string]: number } | undefined {
  const keyFieldMap: { [key: string]: number } = {};
  const resolve = (dataKey: DataKey): boolean => {
    const col = (Array.isArray(dataKey) ? dataKey : [dataKey])
      .find((name: string) => cols.includes(name));
    if (col === undefined) {
      return false;
    }
    keyFieldMap[col] = cols.indexOf(col);
    return true;
  }
  const isDataKeyMissing = dataKeys.map(resolve).includes(false);
  optionalDataKeys.forEach(resolve);
  return isDataKeyMissing ? undefined : keyFieldMap;
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
   * @param optionalDataKeys
   * @return the indices of the fields in the file or undefined if one or more fields are not found
   */
  getFieldsIndices(fileText: string,
                   dataKeys: DataKey[],
                   optionalDataKeys?: DataKey[])
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
   * @param optionalDataKeys
   * @param errorSubject
   * @param dataSubject
   * @param headerSubject
   */
  readFile(file: File,
           headerRequirements: HeaderRequirement[],
           dataKeys: DataKey[],
           optionalDataKeys: DataKey[],
           errorSubject: Subject<MyFileParserErrors>,
           dataSubject: Subject<any> | undefined,
           headerSubject: Subject<any> | undefined): void;
}

export enum FileType {
  TXT = "txt",
  CSV = "csv",
  FITS = "fits"
}

