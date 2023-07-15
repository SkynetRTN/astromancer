import {TestBed} from '@angular/core/testing';

import {ClusterDataSourceService} from './cluster-data-source.service';

describe('ClusterDataSourceService', () => {
  let service: ClusterDataSourceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClusterDataSourceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
