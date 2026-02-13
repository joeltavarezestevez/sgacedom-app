import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SgHeaderComponent } from './sg-header.component';

describe('SgHeaderComponent', () => {
  let component: SgHeaderComponent;
  let fixture: ComponentFixture<SgHeaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SgHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SgHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
