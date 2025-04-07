import {Subject} from "rxjs";
import {HeaderRequirement, MyFileParserErrors, MyFileParserStrategy} from "./FileParser.util";

//GWOSC text files don't provide headers, they require special parsing
export class MyFileParserTXTGW implements MyFileParserStrategy {
  getData(fileText: string,
          fields: string[],
          fieldsIndices: { [p: string]: number }): any[] | undefined {

    console.log(fileText)
    //Only one field.
    const resultData: any[] = [];
    fileText.split("\n").filter((line: string) => !line.startsWith("#"))
      .map((line: string) => {
        resultData.push(line);
      });
    return resultData;
  }

  getFieldsIndices(fileText: string, dataKeys: string[]) {
    return undefined
  }

  //Have to manually assign keys to the file's data. Hopefully this is consistent.
  getHeaders(fileText: string, headerRequirements: HeaderRequirement[])
    : { [p: string]: string } | undefined {
    const lines = fileText.split("\n");
    const headerLines = lines.filter((line: string) => line.startsWith("#"));
    const headerwords: string[][] = [[]];
    headerLines.map((line: string): any => {
      let words = line.replace("#", "").trim().split(" ")
        headerwords.push(words)
    });

    const headers: {[key: string]: string} = {
      "event": headerwords[1][4],
      "detector": headerwords[1][6],
      "samplerate": headerwords[2][3],
      "timestart": headerwords[3][2],
      "duration": headerwords[3][4],
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

      const data = this.getData(fileText, [], {});
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