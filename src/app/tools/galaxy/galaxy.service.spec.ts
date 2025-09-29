import {TestBed} from '@angular/core/testing';

import {GalaxyService} from './galaxy.service';

describe('GalaxyService', () => {
  let service: GalaxyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GalaxyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
