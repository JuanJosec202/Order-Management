import { beforeEach, describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { AuthSessionService } from './auth-session.service';
import { apiConfig } from '../config/api.config';

describe('AuthSessionService', () => {
  let service: AuthSessionService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthSessionService);
  });

  it('stores a valid token as a session', () => {
    service.storeToken(createToken({
      sub: 'admin@example.com',
      role: 'ADMIN',
      uid: 12,
      exp: Math.floor(Date.now() / 1000) + 3600
    }));

    expect(service.isAuthenticated()).toBe(true);
    expect(service.session()?.email).toBe('admin@example.com');
    expect(service.currentRole()).toBe('ADMIN');
    expect(localStorage.getItem(apiConfig.storageKeys.token)).toBeTruthy();
  });

  it('clears expired tokens on initialization', () => {
    localStorage.setItem(apiConfig.storageKeys.token, createToken({
      sub: 'expired@example.com',
      role: 'OPERATOR',
      uid: 1,
      exp: Math.floor(Date.now() / 1000) - 10
    }));

    const freshService = new AuthSessionService();

    expect(freshService.isAuthenticated()).toBe(false);
    expect(localStorage.getItem(apiConfig.storageKeys.token)).toBeNull();
  });
});

function createToken(payload: Record<string, unknown>): string {
  const header = toBase64Url({ alg: 'none', typ: 'JWT' });
  const body = toBase64Url(payload);
  return `${header}.${body}.signature`;
}

function toBase64Url(value: Record<string, unknown>): string {
  return btoa(JSON.stringify(value)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}
