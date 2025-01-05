import {TestBed} from '@angular/core/testing';

import {PulsarService} from './pulsar.service';

describe('PulsarService', () => {
  let service: PulsarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PulsarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
