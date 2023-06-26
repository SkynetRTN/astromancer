import { TestBed } from '@angular/core/testing';

import { VenusService } from './venus.service';

describe('VenusService', () => {
  let service: VenusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VenusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
