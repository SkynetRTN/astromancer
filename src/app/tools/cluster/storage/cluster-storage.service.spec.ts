import {TestBed} from '@angular/core/testing';

import {ClusterStorageService} from './cluster-storage.service';

describe('ClusterStorageService', () => {
  let service: ClusterStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClusterStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
