import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ObrasComponent } from './obras.component';

describe('ObrasComponent', () => {
  let component: ObrasComponent;
  let fixture: ComponentFixture<ObrasComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ObrasComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ObrasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
