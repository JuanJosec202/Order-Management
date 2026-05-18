import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { FormErrorComponent } from '../../../shared/components/form-error/form-error.component';
import { ProductResponseDto, ProductsApiService } from '../../products/api/products-api.service';
import { OrdersApiService } from '../api/orders-api.service';
import { OrderFormFactory } from '../application/order-form.factory';
import { NotificationService } from '../../../core/services/notification.service';
import { extractApiError } from '../../../shared/utils/api-error.util';

@Component({
  selector: 'app-order-form-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CurrencyPipe,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    PageHeaderComponent,
    FormErrorComponent
  ],
  template: `
    <app-page-header
      eyebrow="Ventas"
      title="Crear orden"
      description="Compón líneas de orden contra el catálogo actual y deja que el backend valide el stock." />

    <mat-card appearance="outlined">
      <form class="entity-form" [formGroup]="form" (ngSubmit)="submit()">
        <div formArrayName="items" class="line-items">
          @for (group of itemControls(); track $index) {
            <div [formGroupName]="$index" class="line-item">
              <mat-form-field appearance="outline">
                <mat-label>Producto</mat-label>
                <mat-select formControlName="productId">
                  @for (product of products(); track product.id) {
                    <mat-option [value]="product.id">
                      {{ product.name }} ({{ product.sku }}) - {{ product.price | currency }}
                    </mat-option>
                  }
                </mat-select>
                <app-form-error [control]="group.get('productId')" />
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Cantidad</mat-label>
                <input matInput type="number" formControlName="quantity" />
                <app-form-error [control]="group.get('quantity')" />
              </mat-form-field>

              <button mat-button type="button" (click)="removeItem($index)" [disabled]="itemControls().length === 1">
                Quitar
              </button>
            </div>
          }
        </div>

        <div class="form-actions">
          <button mat-button type="button" (click)="addItem()">Agregar ítem</button>
          <span class="order-total">Total estimado: {{ estimatedTotal() | currency }}</span>
          <button mat-flat-button type="submit" [disabled]="form.invalid || submitting()">
            {{ submitting() ? 'Creando...' : 'Crear orden' }}
          </button>
        </div>
      </form>
    </mat-card>
  `,
  styles: [`
    .entity-form {
      display: grid;
      gap: 1rem;
    }

    .line-items {
      display: grid;
      gap: 1rem;
    }

    .line-item {
      display: grid;
      grid-template-columns: minmax(0, 2fr) minmax(150px, 220px) auto;
      gap: 1rem;
      align-items: start;
      padding: 1rem;
      border: 1px solid #d7e0e8;
      border-radius: 1rem;
      background: #fbfdff;
    }

    .form-actions {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .order-total {
      color: #13334f;
      font-weight: 700;
    }

    @media (max-width: 960px) {
      .line-item {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class OrderFormPageComponent {
  private readonly productsApi = inject(ProductsApiService);
  private readonly ordersApi = inject(OrdersApiService);
  private readonly orderFormFactory = inject(OrderFormFactory);
  private readonly notifications = inject(NotificationService);
  private readonly router = inject(Router);

  protected readonly products = signal<ProductResponseDto[]>([]);
  protected readonly submitting = signal(false);
  protected readonly form = this.orderFormFactory.create();
  protected readonly estimatedTotal = computed(() => {
    return this.itemControls().reduce((sum, group) => {
      const productId = Number(group.get('productId')?.value);
      const quantity = Number(group.get('quantity')?.value);
      const product = this.products().find((item) => item.id === productId);
      return sum + ((product?.price ?? 0) * (quantity || 0));
    }, 0);
  });

  constructor() {
    void this.loadProducts();
  }

  protected itemControls() {
    return this.orderFormFactory.items(this.form).controls;
  }

  protected addItem(): void {
    this.orderFormFactory.items(this.form).push(this.orderFormFactory.createItem());
  }

  protected removeItem(index: number): void {
    this.orderFormFactory.items(this.form).removeAt(index);
  }

  protected async loadProducts(): Promise<void> {
    try {
      this.products.set(await firstValueFrom(this.productsApi.list()));
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
      const payload = {
        items: this.itemControls().map((group) => ({
          productId: Number(group.get('productId')?.value),
          quantity: Number(group.get('quantity')?.value)
        }))
      };

      const order = await firstValueFrom(this.ordersApi.create(payload));
      this.notifications.success('Orden creada');
      await this.router.navigate(['/app/orders', order.id]);
    } catch (error) {
      this.notifications.error(extractApiError(error).message);
    } finally {
      this.submitting.set(false);
    }
  }
}
