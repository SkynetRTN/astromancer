import {TestBed} from '@angular/core/testing';

import {RadioSearchService} from './radiosearch.service';

describe('RadioSearchService', () => {
  let service: RadioSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RadioSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
