import { TestBed } from '@angular/core/testing';

import { ClusterIsochroneService } from './cluster-isochrone.service';

describe('ClusterIsochroneService', () => {
  let service: ClusterIsochroneService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClusterIsochroneService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
