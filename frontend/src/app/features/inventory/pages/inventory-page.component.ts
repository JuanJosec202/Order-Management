import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { firstValueFrom } from 'rxjs';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { ProductsApiService, ProductResponseDto } from '../../products/api/products-api.service';
import { InventoryApiService } from '../api/inventory-api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { FormErrorComponent } from '../../../shared/components/form-error/form-error.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { extractApiError } from '../../../shared/utils/api-error.util';

interface InventoryRowVm {
  product: ProductResponseDto;
  quantity: number;
}

@Component({
  selector: 'app-inventory-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CurrencyPipe,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    PageHeaderComponent,
    EmptyStateComponent,
    FormErrorComponent,
    StatusBadgeComponent
  ],
  template: `
    <app-page-header
      eyebrow="Stock"
      title="Inventario"
      description="Inspecciona las cantidades actuales por producto y aplica ajustes de stock controlados." />

    <div class="layout">
      <section class="table-section">
        @if (rows().length) {
          <mat-card appearance="outlined">
            <table mat-table [dataSource]="rows()" class="data-table">
              <ng-container matColumnDef="sku">
                <th mat-header-cell *matHeaderCellDef>SKU</th>
                <td mat-cell *matCellDef="let row">{{ row.product.sku }}</td>
              </ng-container>

              <ng-container matColumnDef="product">
                <th mat-header-cell *matHeaderCellDef>Producto</th>
                <td mat-cell *matCellDef="let row">{{ row.product.name }}</td>
              </ng-container>

              <ng-container matColumnDef="price">
                <th mat-header-cell *matHeaderCellDef>Precio</th>
                <td mat-cell *matCellDef="let row">{{ row.product.price | currency }}</td>
              </ng-container>

              <ng-container matColumnDef="quantity">
                <th mat-header-cell *matHeaderCellDef>Disponibilidad</th>
                <td mat-cell *matCellDef="let row">
                  <app-status-badge
                    [label]="stockLabel(row.quantity)"
                    [tone]="stockTone(row.quantity)" />
                </td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef></th>
                <td mat-cell *matCellDef="let row">
                  <button mat-button type="button" (click)="select(row, 'increase')">Aumentar</button>
                  <button mat-button type="button" (click)="select(row, 'decrease')">Disminuir</button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
          </mat-card>
        } @else {
          <app-empty-state
            title="El inventario está vacío"
            description="Primero crea productos del catálogo. Las filas de stock se derivan de los ids de producto." />
        }
      </section>

      <mat-card appearance="outlined" class="adjust-panel">
        <h3>Ajuste de stock</h3>
        @if (selectedRow()) {
          <p class="panel-copy">
            {{ adjustmentMode() === 'increase' ? 'Aumentar' : 'Disminuir' }} stock para
            <strong>{{ selectedRow()!.product.name }}</strong>
          </p>
          <p class="panel-note">Stock disponible actual: {{ selectedRow()!.quantity }}</p>

          <form [formGroup]="adjustmentForm" (ngSubmit)="applyAdjustment()" class="adjust-form">
            <mat-form-field appearance="outline">
              <mat-label>Cantidad</mat-label>
              <input matInput type="number" formControlName="amount" />
              <app-form-error [control]="adjustmentForm.controls.amount" />
            </mat-form-field>

            <button mat-flat-button type="submit" [disabled]="adjustmentForm.invalid || submitting()">
              {{ submitting() ? 'Aplicando...' : 'Aplicar ajuste' }}
            </button>
          </form>
        } @else {
          <p class="panel-copy">Elige una fila de producto para aumentar o disminuir el stock disponible.</p>
        }
      </mat-card>
    </div>
  `,
  styles: [`
    .layout {
      display: grid;
      grid-template-columns: minmax(0, 2fr) minmax(300px, 1fr);
      gap: 1rem;
    }

    .data-table {
      width: 100%;
    }

    .adjust-panel {
      align-self: start;
      border-radius: 1.25rem;
    }

    .panel-copy {
      color: var(--color-text-muted);
      line-height: 1.5;
    }

    .panel-note {
      margin: 0;
      color: var(--color-primary);
      font-weight: 700;
    }

    .adjust-form {
      display: grid;
      gap: 1rem;
      margin-top: 1rem;
    }

    @media (max-width: 1100px) {
      .layout {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class InventoryPageComponent {
  private readonly productsApi = inject(ProductsApiService);
  private readonly inventoryApi = inject(InventoryApiService);
  private readonly notifications = inject(NotificationService);
  private readonly fb = inject(FormBuilder);

  protected readonly displayedColumns = ['sku', 'product', 'price', 'quantity', 'actions'];
  protected readonly rows = signal<InventoryRowVm[]>([]);
  protected readonly selectedRow = signal<InventoryRowVm | null>(null);
  protected readonly adjustmentMode = signal<'increase' | 'decrease'>('increase');
  protected readonly submitting = signal(false);
  protected readonly adjustmentForm = this.fb.nonNullable.group({
    amount: [1, [Validators.required, Validators.min(1)]]
  });
  protected readonly selectedProductId = computed(() => this.selectedRow()?.product.id ?? null);

  constructor() {
    void this.load();
  }

  protected async load(): Promise<void> {
    try {
      const products = await firstValueFrom(this.productsApi.list());
      const rows = await Promise.all(products.map(async (product) => ({
        product,
        quantity: (await firstValueFrom(this.inventoryApi.getStock(product.id))).quantity
      })));

      this.rows.set(rows);
    } catch (error) {
      this.notifications.error(extractApiError(error).message);
    }
  }

  protected select(row: InventoryRowVm, mode: 'increase' | 'decrease'): void {
    this.selectedRow.set(row);
    this.adjustmentMode.set(mode);
    this.adjustmentForm.reset({ amount: 1 });
  }

  protected async applyAdjustment(): Promise<void> {
    if (!this.selectedProductId() || this.adjustmentForm.invalid || this.submitting()) {
      this.adjustmentForm.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    try {
      const amount = this.adjustmentForm.getRawValue().amount;
      const productId = this.selectedProductId()!;
      const response = this.adjustmentMode() === 'increase'
        ? await firstValueFrom(this.inventoryApi.increase(productId, amount))
        : await firstValueFrom(this.inventoryApi.decrease(productId, amount));

      this.rows.update((rows) => rows.map((row) => row.product.id === productId ? { ...row, quantity: response.quantity } : row));
      this.notifications.success('Stock actualizado');
      this.adjustmentForm.reset({ amount: 1 });
    } catch (error) {
      this.notifications.error(extractApiError(error).message);
    } finally {
      this.submitting.set(false);
    }
  }

  protected stockLabel(quantity: number): string {
    if (quantity <= 0) {
      return 'SIN STOCK';
    }
    if (quantity <= 5) {
      return `BAJO: ${quantity}`;
    }
    return `DISPONIBLE: ${quantity}`;
  }

  protected stockTone(quantity: number): 'danger' | 'warn' | 'success' {
    if (quantity <= 0) {
      return 'danger';
    }
    if (quantity <= 5) {
      return 'warn';
    }
    return 'success';
  }
}
