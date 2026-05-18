import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { apiConfig } from '../../../core/config/api.config';

export interface InventoryResponseDto {
  productId: number;
  quantity: number;
  createdAt: string | null;
  updatedAt: string | null;
}

@Injectable({ providedIn: 'root' })
export class InventoryApiService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = `${apiConfig.baseUrl}/inventory`;

  getStock(productId: number) {
    return this.http.get<InventoryResponseDto>(`${this.endpoint}/${productId}`);
  }

  increase(productId: number, amount: number) {
    return this.http.post<InventoryResponseDto>(`${this.endpoint}/${productId}/increase`, { amount });
  }

  decrease(productId: number, amount: number) {
    return this.http.post<InventoryResponseDto>(`${this.endpoint}/${productId}/decrease`, { amount });
  }
}
