import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ObrasFormComponent } from './obras-form.component';

describe('ObrasFormComponent', () => {
  let component: ObrasFormComponent;
  let fixture: ComponentFixture<ObrasFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ObrasFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ObrasFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
