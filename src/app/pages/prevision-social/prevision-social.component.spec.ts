import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PrevisionSocialComponent } from './prevision-social.component';

describe('PrevisionSocialComponent', () => {
  let component: PrevisionSocialComponent;
  let fixture: ComponentFixture<PrevisionSocialComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [PrevisionSocialComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PrevisionSocialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
