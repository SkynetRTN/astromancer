import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {interval, Subject, takeUntil} from "rxjs";

export class Job {
  private readonly url: string;
  private readonly updateInterval: number;

  private id: number | null = null;
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


  constructor(url: string, private http: HttpClient, updateInterval: number = 1000) {
    this.url = url;
    this.updateInterval = updateInterval;
  }

  public getJobId(): number | null {
    return this.id;
  }

  public createJob(payload: any): void {
    this.http.post(
      `${environment.apiUrl}${this.url}`,
      JSON.stringify(payload),
      {headers: {'content-type': 'application/json'}}).subscribe(
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
      }
    )
  }

  public reincarnate(object: JobStorageObject): void {
    this.id = object.id;
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
      updateInterval: this.updateInterval,
      status: this.status,
    }
  }

  private updateJob(): void {
    if (this.id === null)
      return;
    this.http.get(`${environment.apiUrl}/job`,
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
