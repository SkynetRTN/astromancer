import { TestBed } from '@angular/core/testing';

import { ScatterService } from './scatter.service';

describe('ScatterService', () => {
  let service: ScatterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScatterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
