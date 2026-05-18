import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { Router } from '@angular/router';
import { AuthSessionService } from '../auth/auth-session.service';
import { guestGuard } from './guest.guard';

describe('guestGuard', () => {
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

  it('allows access for guests', () => {
    const result = TestBed.runInInjectionContext(() => guestGuard({} as never, {} as never));
    expect(result).toBe(true);
  });

  it('redirects authenticated users to dashboard', () => {
    authSession.storeToken(createToken({
      sub: 'admin@example.com',
      role: 'ADMIN',
      uid: 10,
      exp: Math.floor(Date.now() / 1000) + 3600
    }));

    const result = TestBed.runInInjectionContext(() => guestGuard({} as never, {} as never));
    expect(result).toEqual(router.createUrlTree(['/app/dashboard']));
  });
});

function createToken(payload: Record<string, unknown>): string {
  const header = btoa(JSON.stringify({ alg: 'none', typ: 'JWT' })).replace(/=+$/g, '');
  const body = btoa(JSON.stringify(payload)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
  return `${header}.${body}.sig`;
}
