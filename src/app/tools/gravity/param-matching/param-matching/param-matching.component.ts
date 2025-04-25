import {Component, OnDestroy} from '@angular/core';
import {auditTime, BehaviorSubject, debounce, debounceTime, Subject, takeUntil, throttleTime, withLatestFrom} from "rxjs";
import { HttpClient } from '@angular/common/http';
import { GravityDataService } from '../../gravity-data.service';

@Component({
  selector: 'app-gravity-param-matching',
  templateUrl: './param-matching.component.html',
  styleUrls: ['./param-matching.component.scss', ]
})
export class ParamMatching implements OnDestroy {

  private destroy$: Subject<void> = new Subject<void>();


  // private fileParser: MyFileParser;

  constructor(
    private dataService: GravityDataService,
    private http: HttpClient) {
  }

  actionHandler($action: any) {

  }

  reset() {
    this.dataService.reset()
  }

  uploadHandler($event: File) {
    this.dataService.uploadHandler($event)
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}