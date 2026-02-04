import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

export type ChartEngine = 'highcharts' | 'echarts';

@Injectable({
  providedIn: 'root',
})
export class ChartEngineService {
  private readonly storageKey = 'chartEngine';
  private engineSubject = new BehaviorSubject<ChartEngine>(this.getChartEngine());
  chartEngine$ = this.engineSubject.asObservable();

  getChartEngine(): ChartEngine {
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      return JSON.parse(stored) as ChartEngine;
    }
    return 'highcharts';
  }

  setChartEngine(engine: ChartEngine): void {
    localStorage.setItem(this.storageKey, JSON.stringify(engine));
    this.engineSubject.next(engine);
  }
}
