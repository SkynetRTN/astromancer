import {TestBed} from '@angular/core/testing';

import {AppearanceStorageService} from './appearance-storage.service';

describe('AppearanceStorageService', () => {
  let service: AppearanceStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppearanceStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
