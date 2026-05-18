import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { FormErrorComponent } from '../../../shared/components/form-error/form-error.component';
import { ListToolbarComponent } from '../../../shared/components/list-toolbar/list-toolbar.component';
import { SimplePaginatorComponent } from '../../../shared/components/simple-paginator/simple-paginator.component';
import { NotificationService } from '../../../core/services/notification.service';
import { PaymentsApiService, PaymentResponseDto } from '../api/payments-api.service';
import { extractApiError } from '../../../shared/utils/api-error.util';

@Component({
  selector: 'app-payments-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    CurrencyPipe,
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    PageHeaderComponent,
    StatusBadgeComponent,
    EmptyStateComponent,
    FormErrorComponent,
    ListToolbarComponent,
    SimplePaginatorComponent
  ],
  template: `
    <app-page-header
      eyebrow="Pagos"
      title="Payments"
      description="Simula el procesamiento de pagos sobre órdenes existentes y audita intentos previos." />

    <div class="layout">
      <mat-card appearance="outlined">
        <h3>Procesar pago</h3>
        <form [formGroup]="form" (ngSubmit)="submit()" class="payment-form">
          <mat-form-field appearance="outline">
            <mat-label>ID de orden</mat-label>
            <input matInput type="number" formControlName="orderId" />
            <app-form-error [control]="form.controls.orderId" />
          </mat-form-field>

          <mat-checkbox formControlName="approved">Aprobado</mat-checkbox>

          <mat-form-field appearance="outline">
            <mat-label>Motivo de rechazo</mat-label>
            <textarea matInput rows="3" formControlName="rejectionReason"></textarea>
            <app-form-error [control]="form.controls.rejectionReason" />
          </mat-form-field>

          <button mat-flat-button type="submit" [disabled]="form.invalid || submitting()">
            {{ submitting() ? 'Procesando...' : 'Procesar pago' }}
          </button>
        </form>
      </mat-card>

      <section>
        <app-list-toolbar
          searchPlaceholder="Buscar por id de pago, orden o estado"
          [searchValue]="searchTerm()"
          (searchChange)="updateSearch($event)">
          <button mat-stroked-button type="button" (click)="load()">Actualizar</button>
        </app-list-toolbar>

        @if (filteredPayments().length) {
          <mat-card appearance="outlined">
            <table mat-table [dataSource]="pagedPayments()" class="data-table">
              <ng-container matColumnDef="id">
                <th mat-header-cell *matHeaderCellDef>ID</th>
                <td mat-cell *matCellDef="let payment">#{{ payment.id }}</td>
              </ng-container>

              <ng-container matColumnDef="orderId">
                <th mat-header-cell *matHeaderCellDef>Orden</th>
                <td mat-cell *matCellDef="let payment">#{{ payment.orderId }}</td>
              </ng-container>

              <ng-container matColumnDef="amount">
                <th mat-header-cell *matHeaderCellDef>Monto</th>
                <td mat-cell *matCellDef="let payment">{{ payment.amount | currency }}</td>
              </ng-container>

              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Estado</th>
                <td mat-cell *matCellDef="let payment">
                  <app-status-badge
                    [label]="payment.status"
                    [tone]="payment.status === 'APPROVED' ? 'success' : 'danger'" />
                </td>
              </ng-container>

              <ng-container matColumnDef="createdAt">
                <th mat-header-cell *matHeaderCellDef>Creado</th>
                <td mat-cell *matCellDef="let payment">{{ payment.createdAt | date:'medium' }}</td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef></th>
                <td mat-cell *matCellDef="let payment">
                  <a mat-button [routerLink]="['/app/payments', payment.id]">Abrir</a>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>

            <app-simple-paginator
              [page]="page()"
              [pageSize]="pageSize"
              [totalItems]="filteredPayments().length"
              (previous)="previousPage()"
              (next)="nextPage()" />
          </mat-card>
        } @else {
          <app-empty-state
            [title]="payments().length ? 'Ningún pago coincide con el filtro' : 'Aún no hay pagos procesados'"
            [description]="payments().length ? 'Prueba otro término de búsqueda o limpia el filtro.' : 'Envía un id de orden para simular un pago aprobado o rechazado.'" />
        }
      </section>
    </div>
  `,
  styles: [`
    .layout {
      display: grid;
      grid-template-columns: minmax(320px, 380px) minmax(0, 1fr);
      gap: 1rem;
    }

    .payment-form {
      display: grid;
      gap: 1rem;
    }

    .data-table {
      width: 100%;
    }

    @media (max-width: 1100px) {
      .layout {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class PaymentsPageComponent {
  private readonly paymentsApi = inject(PaymentsApiService);
  private readonly notifications = inject(NotificationService);
  private readonly fb = inject(FormBuilder);

  protected readonly displayedColumns = ['id', 'orderId', 'amount', 'status', 'createdAt', 'actions'];
  protected readonly pageSize = 6;
  protected readonly submitting = signal(false);
  protected readonly payments = signal<PaymentResponseDto[]>([]);
  protected readonly searchTerm = signal('');
  protected readonly page = signal(1);
  protected readonly filteredPayments = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    if (!term) {
      return this.payments();
    }

    return this.payments().filter((payment) =>
      [String(payment.id), String(payment.orderId), payment.status, payment.rejectionReason ?? ''].some((value) =>
        value.toLowerCase().includes(term)
      )
    );
  });
  protected readonly pagedPayments = computed(() => {
    const page = this.page();
    const start = (page - 1) * this.pageSize;
    return this.filteredPayments().slice(start, start + this.pageSize);
  });
  protected readonly form = this.fb.nonNullable.group({
    orderId: [0, [Validators.required, Validators.min(1)]],
    approved: [true],
    rejectionReason: ['', [Validators.maxLength(255)]]
  });

  constructor() {
    void this.load();
  }

  protected async load(): Promise<void> {
    try {
      this.payments.set(await firstValueFrom(this.paymentsApi.list()));
      this.page.set(1);
    } catch (error) {
      this.notifications.error(extractApiError(error).message);
    }
  }

  protected async submit(): Promise<void> {
    if (this.form.invalid || this.submitting()) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    try {
      const raw = this.form.getRawValue();
      await firstValueFrom(this.paymentsApi.process({
        orderId: raw.orderId,
        approved: raw.approved,
        rejectionReason: raw.approved ? null : raw.rejectionReason || null
      }));

      this.notifications.success('Pago procesado');
      this.form.reset({ orderId: 0, approved: true, rejectionReason: '' });
      await this.load();
    } catch (error) {
      this.notifications.error(extractApiError(error).message);
    } finally {
      this.submitting.set(false);
    }
  }

  protected updateSearch(value: string): void {
    this.searchTerm.set(value);
    this.page.set(1);
  }

  protected previousPage(): void {
    this.page.update((page) => Math.max(1, page - 1));
  }

  protected nextPage(): void {
    const totalPages = Math.max(1, Math.ceil(this.filteredPayments().length / this.pageSize));
    this.page.update((page) => Math.min(totalPages, page + 1));
  }
}
