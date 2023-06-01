import {TestBed} from '@angular/core/testing';

import {AppearanceStorageService} from './appearance-storage.service';

describe('AppearanceService', () => {
  let service: AppearanceStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppearanceStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
