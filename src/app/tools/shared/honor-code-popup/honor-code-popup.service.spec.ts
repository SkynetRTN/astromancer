import {TestBed} from '@angular/core/testing';

import {HonorCodePopupService} from './honor-code-popup.service';

describe('HonorCodePopupService', () => {
  let service: HonorCodePopupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HonorCodePopupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
