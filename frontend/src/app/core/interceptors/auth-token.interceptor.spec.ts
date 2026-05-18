import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { beforeEach, describe, expect, it } from 'vitest';
import { AuthSessionService } from '../auth/auth-session.service';
import { authTokenInterceptor } from './auth-token.interceptor';

describe('authTokenInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let authSession: AuthSessionService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authTokenInterceptor])),
        provideHttpClientTesting()
      ]
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    authSession = TestBed.inject(AuthSessionService);
  });

  it('adds the bearer token when a session exists', () => {
    authSession.storeToken(createToken({
      sub: 'admin@example.com',
      role: 'ADMIN',
      uid: 10,
      exp: Math.floor(Date.now() / 1000) + 3600
    }));

    http.get('/api/products').subscribe();
    const request = httpMock.expectOne('/api/products');
    expect(request.request.headers.get('Authorization')).toContain('Bearer ');
    request.flush([]);
  });
});

function createToken(payload: Record<string, unknown>): string {
  const header = btoa(JSON.stringify({ alg: 'none', typ: 'JWT' })).replace(/=+$/g, '');
  const body = btoa(JSON.stringify(payload)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
  return `${header}.${body}.sig`;
}
