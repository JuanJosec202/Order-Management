import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { OrdersApiService, OrderResponseDto } from '../api/orders-api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { extractApiError } from '../../../shared/utils/api-error.util';

@Component({
  selector: 'app-order-detail-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    CurrencyPipe,
    MatCardModule,
    MatTableModule,
    PageHeaderComponent,
    StatusBadgeComponent
  ],
  template: `
    @if (order()) {
      <app-page-header
        eyebrow="Ventas"
        [title]="'Orden #' + order()!.id"
        description="Revisa líneas persistidas, totales y estado del ciclo de vida desde el backend." />

      <div class="summary-grid">
        <mat-card appearance="outlined">
          <h3>Estado</h3>
          <app-status-badge
            [label]="order()!.status"
            [tone]="order()!.status === 'PAID' ? 'success' : order()!.status === 'CANCELLED' ? 'danger' : 'info'" />
          <p>Creada: {{ order()!.createdAt | date:'medium' }}</p>
          <p>Actualizada: {{ order()!.updatedAt | date:'medium' }}</p>
        </mat-card>

        <mat-card appearance="outlined">
          <h3>Total</h3>
          <p class="total">{{ order()!.totalAmount | currency }}</p>
          <p>Creada por: {{ order()!.createdBy }}</p>
          <p>Actualizada por: {{ order()!.updatedBy }}</p>
        </mat-card>
      </div>

      <mat-card appearance="outlined">
        <table mat-table [dataSource]="order()!.items" class="data-table">
          <ng-container matColumnDef="product">
            <th mat-header-cell *matHeaderCellDef>Producto</th>
            <td mat-cell *matCellDef="let item">{{ item.productName }}</td>
          </ng-container>

          <ng-container matColumnDef="quantity">
            <th mat-header-cell *matHeaderCellDef>Cantidad</th>
            <td mat-cell *matCellDef="let item">{{ item.quantity }}</td>
          </ng-container>

          <ng-container matColumnDef="unitPrice">
            <th mat-header-cell *matHeaderCellDef>Precio unitario</th>
            <td mat-cell *matCellDef="let item">{{ item.unitPrice | currency }}</td>
          </ng-container>

          <ng-container matColumnDef="lineTotal">
            <th mat-header-cell *matHeaderCellDef>Total de línea</th>
            <td mat-cell *matCellDef="let item">{{ item.lineTotal | currency }}</td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
      </mat-card>
    }
  `,
  styles: [`
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .total {
      font-size: 1.8rem;
      font-weight: 700;
      color: #13334f;
    }

    .data-table {
      width: 100%;
    }
  `]
})
export class OrderDetailPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly ordersApi = inject(OrdersApiService);
  private readonly notifications = inject(NotificationService);

  protected readonly displayedColumns = ['product', 'quantity', 'unitPrice', 'lineTotal'];
  protected readonly order = signal<OrderResponseDto | null>(null);

  constructor() {
    void this.load();
  }

  protected async load(): Promise<void> {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    try {
      this.order.set(await firstValueFrom(this.ordersApi.getById(id)));
    } catch (error) {
      this.notifications.error(extractApiError(error).message);
    }
  }
}
