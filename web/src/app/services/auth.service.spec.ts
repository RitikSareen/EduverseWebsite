import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
describe('AuthService.isLocalStorageAvailable', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  it('should return true when localStorage is available', () => {
    const result = (service as any).isLocalStorageAvailable();
    expect(result).toBe(true);
  });

  it('should return false when localStorage throws error', () => {
    spyOn(localStorage, 'setItem').and.throwError('Storage disabled');
    const result = (service as any).isLocalStorageAvailable();
    expect(result).toBe(false);
  });

  it('should clean up test key even if test passes', () => {
    (service as any).isLocalStorageAvailable();
    expect(localStorage.getItem('_test_')).toBeNull();
  });

  it('should handle localStorage.removeItem throwing error', () => {
    spyOn(localStorage, 'removeItem').and.throwError('Remove failed');
    const result = (service as any).isLocalStorageAvailable();
    expect(result).toBe(false);
  });
});
