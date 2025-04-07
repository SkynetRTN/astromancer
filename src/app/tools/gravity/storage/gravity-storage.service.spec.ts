import {TestBed} from '@angular/core/testing';

import {GravityStorageService} from './gravity-storage.service';

describe('GravityStorageService', () => {
  let service: GravityStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GravityStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
