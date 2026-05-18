import { Injectable, computed, signal } from '@angular/core';
import { apiConfig } from '../config/api.config';
import { AuthSession } from '../types/auth-session.model';
import { decodeJwt } from '../../shared/utils/jwt.util';
import { UserRole } from '../../shared/models/domain.models';

@Injectable({ providedIn: 'root' })
export class AuthSessionService {
  private readonly sessionState = signal<AuthSession | null>(this.readStoredSession());

  readonly session = computed(() => this.sessionState());
  readonly isAuthenticated = computed(() => !!this.sessionState());
  readonly currentRole = computed<UserRole | null>(() => this.sessionState()?.role ?? null);

  storeToken(token: string): void {
    const payload = decodeJwt(token);
    if (!payload) {
      this.clear();
      return;
    }

    const session: AuthSession = {
      token,
      email: payload.sub,
      role: payload.role,
      userId: payload.uid,
      expiresAt: payload.exp ? payload.exp * 1000 : undefined
    };

    localStorage.setItem(apiConfig.storageKeys.token, token);
    this.sessionState.set(session);
  }

  clear(): void {
    localStorage.removeItem(apiConfig.storageKeys.token);
    this.sessionState.set(null);
  }

  getToken(): string | null {
    return this.sessionState()?.token ?? null;
  }

  private readStoredSession(): AuthSession | null {
    const token = localStorage.getItem(apiConfig.storageKeys.token);
    if (!token) {
      return null;
    }

    const payload = decodeJwt(token);
    if (!payload) {
      localStorage.removeItem(apiConfig.storageKeys.token);
      return null;
    }

    const expiresAt = payload.exp ? payload.exp * 1000 : undefined;
    if (expiresAt && expiresAt <= Date.now()) {
      localStorage.removeItem(apiConfig.storageKeys.token);
      return null;
    }

    return {
      token,
      email: payload.sub,
      role: payload.role,
      userId: payload.uid,
      expiresAt
    };
  }
}
