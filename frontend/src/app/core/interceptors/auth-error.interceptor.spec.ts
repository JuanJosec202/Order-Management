import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpErrorResponse, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthSessionService } from '../auth/auth-session.service';
import { authErrorInterceptor } from './auth-error.interceptor';

describe('authErrorInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let authSession: AuthSessionService;
  const navigate = vi.fn();

  beforeEach(() => {
    localStorage.clear();
    navigate.mockReset();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authErrorInterceptor])),
        provideHttpClientTesting(),
        {
          provide: Router,
          useValue: { navigate }
        }
      ]
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    authSession = TestBed.inject(AuthSessionService);
  });

  it('clears the session and redirects on 401 errors', async () => {
    authSession.storeToken(createToken({
      sub: 'admin@example.com',
      role: 'ADMIN',
      uid: 10,
      exp: Math.floor(Date.now() / 1000) + 3600
    }));

    const requestPromise = new Promise<HttpErrorResponse>((resolve) => {
      http.get('/api/products').subscribe({
        error: (error) => resolve(error)
      });
    });

    const request = httpMock.expectOne('/api/products');
    request.flush({ message: 'Authentication is required' }, { status: 401, statusText: 'Unauthorized' });

    await requestPromise;

    expect(authSession.isAuthenticated()).toBe(false);
    expect(navigate).toHaveBeenCalledWith(['/login']);
  });
});

function createToken(payload: Record<string, unknown>): string {
  const header = btoa(JSON.stringify({ alg: 'none', typ: 'JWT' })).replace(/=+$/g, '');
  const body = btoa(JSON.stringify(payload)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
  return `${header}.${body}.sig`;
}
