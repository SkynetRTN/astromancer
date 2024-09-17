import {TestBed} from '@angular/core/testing';

import {RadioSearchStorageService} from './radiosearch-storage.service';

describe('RadioSearchStorageService', () => {
  let service: RadioSearchStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RadioSearchStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
