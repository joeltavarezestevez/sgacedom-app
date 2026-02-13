import { TestBed } from '@angular/core/testing';

import { PrevisionSocialService } from './prevision-social.service';

describe('PrevisionSocialService', () => {
  let service: PrevisionSocialService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrevisionSocialService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
