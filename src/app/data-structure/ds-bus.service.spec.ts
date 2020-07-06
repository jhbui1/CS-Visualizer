import { TestBed } from '@angular/core/testing';

import { DsBusService } from './ds-bus.service';

describe('DsBusService', () => {
  let service: DsBusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DsBusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
