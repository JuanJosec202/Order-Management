import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { PaymentsApiService, PaymentResponseDto } from '../api/payments-api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { extractApiError } from '../../../shared/utils/api-error.util';

@Component({
  selector: 'app-payment-detail-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, CurrencyPipe, MatCardModule, PageHeaderComponent, StatusBadgeComponent],
  template: `
    @if (payment()) {
      <app-page-header
        eyebrow="Pagos"
        [title]="'Pago #' + payment()!.id"
        description="Inspecciona el resultado persistido de un procesamiento de pago simulado." />

      <mat-card appearance="outlined" class="detail-card">
        <div class="row">
          <span>Orden</span>
          <strong>#{{ payment()!.orderId }}</strong>
        </div>
        <div class="row">
          <span>Monto</span>
          <strong>{{ payment()!.amount | currency }}</strong>
        </div>
        <div class="row">
          <span>Estado</span>
          <app-status-badge
            [label]="payment()!.status"
            [tone]="payment()!.status === 'APPROVED' ? 'success' : 'danger'" />
        </div>
        <div class="row">
          <span>Creado</span>
          <strong>{{ payment()!.createdAt | date:'medium' }}</strong>
        </div>
        <div class="row">
          <span>Motivo de rechazo</span>
          <strong>{{ payment()!.rejectionReason || 'No aplica' }}</strong>
        </div>
      </mat-card>
    }
  `,
  styles: [`
    .detail-card {
      display: grid;
      gap: 1rem;
      max-width: 40rem;
    }

    .row {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      align-items: center;
      padding-bottom: 0.85rem;
      border-bottom: 1px solid #e2e8ef;
    }

    .row:last-child {
      padding-bottom: 0;
      border-bottom: 0;
    }

    span {
      color: #5d7082;
    }
  `]
})
export class PaymentDetailPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly paymentsApi = inject(PaymentsApiService);
  private readonly notifications = inject(NotificationService);

  protected readonly payment = signal<PaymentResponseDto | null>(null);

  constructor() {
    void this.load();
  }

  protected async load(): Promise<void> {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    try {
      this.payment.set(await firstValueFrom(this.paymentsApi.getById(id)));
    } catch (error) {
      this.notifications.error(extractApiError(error).message);
    }
  }
}
