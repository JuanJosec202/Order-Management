import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { apiConfig } from '../../../core/config/api.config';

export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface TokenResponseDto {
  accessToken: string;
  tokenType: string;
}

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  private readonly http = inject(HttpClient);

  login(payload: LoginRequestDto) {
    return this.http.post<TokenResponseDto>(`${apiConfig.baseUrl}/auth/login`, payload);
  }
}
