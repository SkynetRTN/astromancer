import {TestBed} from '@angular/core/testing';

import {MoonService} from './moon.service';

describe('MoonService', () => {
  let service: MoonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MoonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
