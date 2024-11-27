import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { AuthGuard } from './auth.guard';

import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authService = jasmine.createSpyObj('AuthService', ['isSignedIn']);
    router = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router }
      ]
    });

    guard = TestBed.inject(AuthGuard);
  });

  it('should allow access when user is signed in', () => {
    Object.defineProperty(authService, 'isSignedIn', { value: true, writable: true });
    expect(guard.canActivate()).toBe(true);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should redirect to sign in page when user is not authenticated', () => {
    Object.defineProperty(authService, 'isSignedIn', { value: false, writable: true });
    expect(guard.canActivate()).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/auth/signIn']);
  });
  it('should create the guard', () => {
    expect(guard).toBeTruthy();
  });
});
