import {Subject} from "rxjs";
import {
  DataKey,
  getFieldsIndicesFromCols,
  HeaderRequirement,
  MyFileParserErrors,
  MyFileParserStrategy
} from "./FileParser.util";

export class MyFileParserFITS implements MyFileParserStrategy {
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

    getFieldsIndices(fileText: string, dataKeys: DataKey[], optionalDataKeys: DataKey[] = [])
        : { [p: string]: number } | undefined {
        const lines = fileText.split("\n");
        const nonDataLines = lines.filter((line: string) => line.startsWith("#"));
        const cols: string[] = nonDataLines[nonDataLines.length - 1]
        .replace("#", "").split(/\s+/)
        .map((col: string) => col.trim()).filter((col: string) => col !== "");
        return getFieldsIndicesFromCols(cols, dataKeys, optionalDataKeys);
    }

    getHeaders(fileText: string, headerRequirements: HeaderRequirement[])
        : { [p: string]: string } | undefined {
        const headerLines = fileText.match(/.{1,80}/g);
        if (!headerLines) {
            return undefined;
        }
        const headers: { [key: string]: string } = {};
        for (const line of headerLines) {
            const key = line.substring(0, 8).trim();
            const value = line.substring(10).split('/')[0].trim();
            if (key === "END") {
                break; 
            }
            if (key) {
                headers[key] = value;
            }
        }

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
        const headers = this.getHeaders(fileText, headerRequirements);
        if (headers === undefined) {
        errorSubject.next(MyFileParserErrors.HEADER);
        return;
        }
        if (headerSubject !== undefined) {
        headerSubject.next(headers);
        }
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
        return file.name.endsWith(".fits");
      }
}