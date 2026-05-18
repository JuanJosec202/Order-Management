import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { apiConfig } from '../../../core/config/api.config';
import { PaymentStatus } from '../../../shared/models/domain.models';

export interface PaymentResponseDto {
  id: number;
  orderId: number;
  amount: number;
  status: PaymentStatus;
  rejectionReason: string | null;
  createdAt: string;
}

export interface ProcessPaymentDto {
  orderId: number;
  approved: boolean;
  rejectionReason: string | null;
}

@Injectable({ providedIn: 'root' })
export class PaymentsApiService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = `${apiConfig.baseUrl}/payments`;

  list() {
    return this.http.get<PaymentResponseDto[]>(this.endpoint);
  }

  getById(id: number) {
    return this.http.get<PaymentResponseDto>(`${this.endpoint}/${id}`);
  }

  process(payload: ProcessPaymentDto) {
    return this.http.post<PaymentResponseDto>(this.endpoint, payload);
  }
}
