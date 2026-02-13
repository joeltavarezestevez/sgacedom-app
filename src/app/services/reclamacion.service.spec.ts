import { TestBed } from '@angular/core/testing';

import { ReclamacionService } from './reclamacion.service';

describe('ReclamacionService', () => {
  let service: ReclamacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReclamacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
