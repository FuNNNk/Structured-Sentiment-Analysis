import { TestBed } from '@angular/core/testing';

import { LogginAspectService } from './loggin-aspect.service';

describe('LogginAspectService', () => {
  let service: LogginAspectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LogginAspectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
