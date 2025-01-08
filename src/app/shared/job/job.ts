import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {interval, Subject, takeUntil} from "rxjs";

export class Job {
  private readonly url: string;
  private readonly updateInterval: number;

  private id: number | null = null;
  private type: JobType;
  private status: JobStatus = JobStatus.PENDING;
  private progress: number | null = null;

  private statusUpdateSubject = new Subject<JobStatus>();
  public statusUpdate$ = this.statusUpdateSubject.asObservable();
  private progressUpdateSubject = new Subject<number | null>();
  public progressUpdate$ = this.progressUpdateSubject.asObservable();
  private updateSubject = new Subject<Job>();
  public update$ = this.updateSubject.asObservable();
  private completeSubject = new Subject<Boolean>();
  public complete$ = this.completeSubject.asObservable();
  private error: HttpErrorResponse | null = null;


  constructor(url: string, type: JobType, private http: HttpClient, updateInterval: number = 1000) {
    this.url = url;
    this.type = type;
    this.updateInterval = updateInterval;
  }

  public getJobId(): number | null {
    return this.id;
  }

  public getError(): HttpErrorResponse | null {
    return this.error;
  }

  //TODO: talk to Reed about this
  public createJob(payload: any): void {
    let contenttype = "multipart/form-data"

    if(!(payload instanceof FormData))
    {
      console.log("json detected")
      contenttype = 'application/json'
      payload = JSON.stringify(payload)
    }

    this.http.post(
      `${environment.apiUrl}${this.url}`,
      payload).subscribe(
      (resp: any) => {
        resp = resp as JobResponse;
        this.id = resp.id;
        interval(this.updateInterval).pipe(
          takeUntil(this.complete$)
        ).subscribe(
          () => {
            this.updateJob();
          }
        )
      },
      (error: HttpErrorResponse) => {
        this.error = error;
        this.completeSubject.next(false);
      }
    )
  }

  public cancelJob(): void {
    this.completeSubject.next(false);
  }

  public reincarnate(object: JobStorageObject): void {
    this.id = object.id;
    this.type = object.type;
    this.status = object.status;
    interval(this.updateInterval).pipe(
      takeUntil(this.complete$)
    ).subscribe(
      () => {
        this.updateJob();
      }
    );
  }

  public getStorageObject(): JobStorageObject {
    return {
      id: this.id!,
      url: this.url,
      type: this.type,
      updateInterval: this.updateInterval,
      status: this.status,
    }
  }

  private updateJob(): void {
    if (this.id === null)
      return;
    this.http.get(`${environment.apiUrl}/job/state`,
      {params: {'id': this.id.toString()}}).subscribe(
      (resp: any) => {
        resp = resp as JobResponse;
        if (resp.status !== this.status) {
          this.status = resp.status;
          this.statusUpdateSubject.next(this.status);
        }
        if (resp.progress !== this.progress) {
          this.progress = resp.progress;
          this.progressUpdateSubject.next(this.progress);
        }
        if (this.status === JobStatus.COMPLETED) {
          this.completeSubject.next(true);
        } else if (this.status === JobStatus.FAILED) {
          this.completeSubject.next(false);
        }
        this.updateSubject.next(this);
      }
    );
  }
}

export interface JobStorageObject {
  id: number;
  type: JobType;
  url: string;
  updateInterval: number;
  status: JobStatus;
  payload?: any;
}

export enum JobStatus {
  PENDING = "PENDING",
  RUNNING = "RUNNING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
}

export interface JobResponse {
  id: number
  type: string;
  status: JobStatus;
  progress: number;
}

export enum JobType {
  FIELD_STAR_REMOVAL = "FIELD_STAR_REMOVAL",
  FETCH_CATALOG = "FETCH_CATALOG",
  PROCESS_GRAVITY_DATA = "PROCESS_GRAVITY_DATA",
}
