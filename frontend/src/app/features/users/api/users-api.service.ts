import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { apiConfig } from '../../../core/config/api.config';
import { UserRole } from '../../../shared/models/domain.models';

export interface UserResponseDto {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface UserUpsertDto {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  active: boolean;
}

@Injectable({ providedIn: 'root' })
export class UsersApiService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = `${apiConfig.baseUrl}/users`;

  list() {
    return this.http.get<UserResponseDto[]>(this.endpoint);
  }

  getById(id: number) {
    return this.http.get<UserResponseDto>(`${this.endpoint}/${id}`);
  }

  create(payload: UserUpsertDto) {
    return this.http.post<UserResponseDto>(this.endpoint, payload);
  }

  update(id: number, payload: UserUpsertDto) {
    return this.http.put<UserResponseDto>(`${this.endpoint}/${id}`, payload);
  }
}
