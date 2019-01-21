import { TestBed } from '@angular/core/testing';

import { TokenSaveService } from './token-save.service';

describe('TokenSaveService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TokenSaveService = TestBed.get(TokenSaveService);
    expect(service).toBeTruthy();
  });
});
