import {TestBed} from '@angular/core/testing';

import {AppearanceService} from './appearance.service';

describe('AppearanceService', () => {
  let service: AppearanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppearanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
