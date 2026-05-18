import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { apiConfig } from '../../../core/config/api.config';

export interface ProductResponseDto {
  id: number;
  sku: string;
  name: string;
  description: string | null;
  price: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface ProductUpsertDto {
  sku: string;
  name: string;
  description: string | null;
  price: number;
}

@Injectable({ providedIn: 'root' })
export class ProductsApiService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = `${apiConfig.baseUrl}/products`;

  list() {
    return this.http.get<ProductResponseDto[]>(this.endpoint);
  }

  getById(id: number) {
    return this.http.get<ProductResponseDto>(`${this.endpoint}/${id}`);
  }

  create(payload: ProductUpsertDto) {
    return this.http.post<ProductResponseDto>(this.endpoint, payload);
  }

  update(id: number, payload: ProductUpsertDto) {
    return this.http.put<ProductResponseDto>(`${this.endpoint}/${id}`, payload);
  }
}
