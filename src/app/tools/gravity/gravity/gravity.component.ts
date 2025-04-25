import {Component, OnDestroy} from '@angular/core';
import {auditTime, BehaviorSubject, debounce, debounceTime, Subject, takeUntil, throttleTime, withLatestFrom} from "rxjs";
import { HttpClient } from '@angular/common/http';
import { GravityDataService } from '../gravity-data.service';

@Component({
  selector: 'app-gravity',
  templateUrl: './gravity.component.html',
  styleUrls: ['./gravity.component.scss', '../../shared/interface/tools.scss']
})
export class GravityComponent implements OnDestroy {

  private destroy$: Subject<void> = new Subject<void>();

  public dataReady = false;

  constructor(
    private dataService: GravityDataService,
    private http: HttpClient) {

      dataService.jobProgress$.subscribe((p) => {
        this.dataReady = p>=100
      })
  }


  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }
}