import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { Router } from '@angular/router';
import { AuthSessionService } from '../auth/auth-session.service';
import { authGuard } from './auth.guard';

describe('authGuard', () => {
  let authSession: AuthSessionService;
  let router: Router;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        {
          provide: Router,
          useValue: {
            createUrlTree: (...args: unknown[]) => ({ args })
          }
        }
      ]
    });

    authSession = TestBed.inject(AuthSessionService);
    router = TestBed.inject(Router);
  });

  it('allows access when there is an authenticated session', () => {
    authSession.storeToken(createToken({
      sub: 'admin@example.com',
      role: 'ADMIN',
      uid: 10,
      exp: Math.floor(Date.now() / 1000) + 3600
    }));

    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as never, { url: '/app/dashboard' } as never)
    );

    expect(result).toBe(true);
  });

  it('redirects to login when there is no session', () => {
    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as never, { url: '/app/products' } as never)
    );

    expect(result).toEqual(router.createUrlTree(['/login'], { queryParams: { redirectTo: '/app/products' } }));
  });
});

function createToken(payload: Record<string, unknown>): string {
  const header = btoa(JSON.stringify({ alg: 'none', typ: 'JWT' })).replace(/=+$/g, '');
  const body = btoa(JSON.stringify(payload)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
  return `${header}.${body}.sig`;
}
