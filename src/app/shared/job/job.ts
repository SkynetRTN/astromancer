import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {interval, Subject, takeUntil} from "rxjs";

export class Job {
  private readonly url: string;
  private readonly updateInterval: number;
  private statusUrl: string | null = null;

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

  public createJob(payload: any): void {
    this.http.post(
      `${environment.apiUrl}${this.url}`,
      JSON.stringify(payload),
      {headers: {'content-type': 'application/json'}}).subscribe(
      (resp: any) => {
        resp = resp as JobResponse;
        this.id = resp.id ?? resp.job_id;
        this.statusUrl = this.resolveStatusUrl(resp);
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
    this.statusUrl = object.statusUrl ?? null;
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
      statusUrl: this.statusUrl,
    }
  }

  private updateJob(): void {
    if (this.id === null)
      return;
    const statusUrl = this.statusUrl ?? `/jobs/${this.id}`;
    this.http.get(this.toApiUrl(statusUrl)).subscribe(
      (resp: any) => {
        resp = resp as JobResponse;
        const nextStatus = resp.status;
        if (nextStatus !== this.status) {
          this.status = nextStatus;
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

  private toApiUrl(url: string): string {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `${environment.apiUrl}${url}`;
  }

  private resolveStatusUrl(resp: JobResponse): string {
    if (resp.status_url) {
      return resp.status_url;
    }
    if (resp.job_id !== undefined) {
      return `/jobs/${resp.job_id}`;
    }
    return `/job/state?id=${resp.id}`;
  }
}

export interface JobStorageObject {
  id: number;
  type: JobType;
  url: string;
  updateInterval: number;
  status: JobStatus;
  statusUrl?: string | null;
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
  id?: number
  job_id?: number
  type: string;
  status: JobStatus;
  progress: number;
  status_url?: string;
}

export enum JobType {
  FIELD_STAR_REMOVAL = "FIELD_STAR_REMOVAL",
  FETCH_CATALOG = "FETCH_CATALOG"
}
