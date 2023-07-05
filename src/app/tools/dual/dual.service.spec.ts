import {TestBed} from '@angular/core/testing';

import {DualService} from './dual.service';

describe('DualService', () => {
  let service: DualService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DualService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
