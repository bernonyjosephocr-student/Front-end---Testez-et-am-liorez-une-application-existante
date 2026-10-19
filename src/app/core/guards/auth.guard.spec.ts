import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';

import { authGuard } from './auth.guard';

describe('authGuard', () => {
  let router: Router;

  const executeGuard: CanActivateFn = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) =>
    TestBed.runInInjectionContext(() =>
      authGuard(route, state)
    );

  // Creates a JWT-like token with the supplied expiration time.
  const createToken = (exp: number): string => {
    const header = btoa(JSON.stringify({ alg: 'none', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({ exp }));

    return `${header}.${payload}.signature`;
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: Router,
          useValue: {
            createUrlTree: jest.fn().mockReturnValue({ redirect: '/login' })
          }
        }
      ]
    });

    router = TestBed.inject(Router);
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should redirect to login when no token exists', () => {
    const result = executeGuard(
      {} as ActivatedRouteSnapshot,
      {} as RouterStateSnapshot
    );

    expect(router.createUrlTree).toHaveBeenCalledWith(['/login']);
    expect(result).toEqual({ redirect: '/login' } as unknown as UrlTree);
  });

  it('should allow access when the token is valid', () => {
    const expiration = Math.floor(Date.now() / 1000) + 3600;

    localStorage.setItem('authToken', createToken(expiration));

    const result = executeGuard(
      {} as ActivatedRouteSnapshot,
      {} as RouterStateSnapshot
    );

    expect(result).toBe(true);
    expect(router.createUrlTree).not.toHaveBeenCalled();
  });

  it('should remove an expired token and redirect to login', () => {
    const expiration = Math.floor(Date.now() / 1000) - 3600;

    localStorage.setItem('authToken', createToken(expiration));

    const result = executeGuard(
      {} as ActivatedRouteSnapshot,
      {} as RouterStateSnapshot
    );

    expect(localStorage.getItem('authToken')).toBeNull();
    expect(router.createUrlTree).toHaveBeenCalledWith(['/login']);
    expect(result).toEqual({ redirect: '/login' } as unknown as UrlTree);
  });
});