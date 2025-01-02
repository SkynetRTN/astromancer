import {TestBed} from '@angular/core/testing';

import {GravityService} from './gravity.service';

describe('GravityService', () => {
  let service: GravityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GravityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
