import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ReporteEventosComponent } from './reporte-eventos.component';

describe('ReporteEventosComponent', () => {
  let component: ReporteEventosComponent;
  let fixture: ComponentFixture<ReporteEventosComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ReporteEventosComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ReporteEventosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
