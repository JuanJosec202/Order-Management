import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { apiConfig } from '../../../core/config/api.config';
import { OrderStatus } from '../../../shared/models/domain.models';

export interface OrderItemResponseDto {
  id: number;
  productId: number;
  productName: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface OrderResponseDto {
  id: number;
  items: OrderItemResponseDto[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface CreateOrderDto {
  items: Array<{
    productId: number;
    quantity: number;
  }>;
}

@Injectable({ providedIn: 'root' })
export class OrdersApiService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = `${apiConfig.baseUrl}/orders`;

  list() {
    return this.http.get<OrderResponseDto[]>(this.endpoint);
  }

  getById(id: number) {
    return this.http.get<OrderResponseDto>(`${this.endpoint}/${id}`);
  }

  create(payload: CreateOrderDto) {
    return this.http.post<OrderResponseDto>(this.endpoint, payload);
  }
}
