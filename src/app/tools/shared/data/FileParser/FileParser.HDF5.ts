import {Subject, takeUntil} from "rxjs";
import {HeaderRequirement, MyFileParserErrors, MyFileParserStrategy} from "./FileParser.util";
import { environment } from "src/environments/environment";
import { Job, JobType, JobStatus } from "src/app/shared/job/job";
import { HttpClient } from "@angular/common/http";

interface GravityResponse
{
  dataSet: [[]],
  headers: {[key: string]: string},
}

//This parser strategy only supports use of readFile(). May want to create a child class of FileParser to avoid using getHeaders outside of that class. 
export class MyFileParserHDF5 implements MyFileParserStrategy {
  constructor(private http: HttpClient){

  }
  
  getData(fileText: GravityResponse, fields: string[],
          fieldsIndices: { [value: string]: number }): any[] | undefined {
    return fileText.dataSet;
  }

  getFieldsIndices(fileText: object, dataKeys: string[]): { [p: string]: number } | undefined {
    return undefined;
  }

  getHeaders(fileText: GravityResponse, headerRequirements: HeaderRequirement[]): { [p: string]: string } | undefined {
    const headers = fileText.headers
    const fileHeaders = Object.keys(headers)
    let isHeaderValid = true;
    headerRequirements.forEach((headerRequirement: HeaderRequirement) => {
          if (!fileHeaders.includes(headerRequirement.key) ||
            (headerRequirement.value !== undefined &&
              headers[headerRequirement.key] !== headerRequirement.value)) {
            isHeaderValid = false;
          }
        })

    return isHeaderValid ? headers : undefined
  }

  readFile(file: File, headerRequirements: HeaderRequirement[], dataKeys: string[],
           errorSubject: Subject<MyFileParserErrors>,
           dataSubject: Subject<any> | undefined,
           headerSubject: Subject<any> | undefined,
           progressSubject: Subject<any> | undefined): void {
    
    //Check format
    if (!this.validateFormat(file)) {
      errorSubject.next(MyFileParserErrors.FORMAT);
      return;
    }

    const gravityJob = new Job('/gravity/file', JobType.PROCESS_GRAVITY_DATA, this.http, 500);
    let payload = new FormData()
    payload.append('file', file as File, 'file')
    gravityJob.createJob(payload);

    //While waiting
    gravityJob.progressUpdate$.pipe(
        takeUntil(gravityJob.complete$)
    ).subscribe((progress) => {
        progressSubject?.next(progress)
    });

    //When done
    gravityJob.complete$.subscribe(
      (complete) => {
        let id = gravityJob.getJobId()
        if (complete && id) {
          this.http.get(`${environment.apiUrl}/gravity/file`,
          {params: {'id': id} }).subscribe(
          (resp: any) => {

            console.log(resp)
            //Headers
            const headers = this.getHeaders(resp.file as GravityResponse, headerRequirements);
            if (headers === undefined) {
              errorSubject.next(MyFileParserErrors.HEADER);
              return;
            }
            if (headerSubject !== undefined) {
              headerSubject.next(headers);
            }

            //Fields
            // const fieldsIndices = this.getFieldsIndices(resp, dataKeys);
            // if (fieldsIndices === undefined) {
            //   errorSubject.next(MyFileParserErrors.FIELD);
            //   return;
            // }

            //Data
            const data = this.getData(resp.file as GravityResponse, dataKeys, {});
            if (data === undefined) {
              errorSubject.next(MyFileParserErrors.DATA);
              return;
            }
            if (dataSubject !== undefined) {
              dataSubject.next(data);
            }
          });
        }

        else errorSubject.next(MyFileParserErrors.FORMAT)
    });
    
  }

  validateFormat(file: File): boolean {
    return file.name.endsWith(".hdf5");
  }
}