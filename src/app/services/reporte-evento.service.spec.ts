import { TestBed } from '@angular/core/testing';

import { ReporteEventoService } from './reporte-evento.service';

describe('ReporteEventoService', () => {
  let service: ReporteEventoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReporteEventoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
