import {TestBed} from '@angular/core/testing';

import {InterfaceService} from './gravity-interface.service';

describe('GravityService', () => {
  let service: InterfaceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InterfaceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
