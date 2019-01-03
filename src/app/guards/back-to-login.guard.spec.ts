import { TestBed, async, inject } from '@angular/core/testing';

import { BackToLoginGuard } from './back-to-login.guard';

describe('BackToLoginGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BackToLoginGuard]
    });
  });

  it('should ...', inject([BackToLoginGuard], (guard: BackToLoginGuard) => {
    expect(guard).toBeTruthy();
  }));
});
