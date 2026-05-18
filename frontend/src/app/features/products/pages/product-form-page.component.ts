import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { firstValueFrom } from 'rxjs';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { FormErrorComponent } from '../../../shared/components/form-error/form-error.component';
import { NotificationService } from '../../../core/services/notification.service';
import { ProductFormFactory } from '../application/product-form.factory';
import { ProductsApiService } from '../api/products-api.service';
import { applyServerFieldErrors } from '../../../shared/utils/form.util';
import { extractApiError } from '../../../shared/utils/api-error.util';

@Component({
  selector: 'app-product-form-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    PageHeaderComponent,
    FormErrorComponent
  ],
  template: `
    <app-page-header
      eyebrow="Catálogo"
      [title]="pageTitle()"
      description="Mantén los datos del producto normalizados antes de que lleguen a inventario y a la creación de órdenes." />

    <mat-card appearance="outlined">
      <form class="entity-form" [formGroup]="form" (ngSubmit)="submit()">
        <mat-form-field appearance="outline">
          <mat-label>SKU</mat-label>
          <input matInput formControlName="sku" />
          <app-form-error [control]="form.controls.sku" />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Nombre</mat-label>
          <input matInput formControlName="name" />
          <app-form-error [control]="form.controls.name" />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Descripción</mat-label>
          <textarea matInput rows="4" formControlName="description"></textarea>
          <app-form-error [control]="form.controls.description" />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Precio</mat-label>
          <input matInput type="number" step="0.01" formControlName="price" />
          <app-form-error [control]="form.controls.price" />
        </mat-form-field>

        <div class="form-actions">
          <button mat-button type="button" (click)="cancel()">Cancelar</button>
          <button mat-flat-button type="submit" [disabled]="form.invalid || submitting()">
            {{ submitting() ? 'Guardando...' : 'Guardar producto' }}
          </button>
        </div>
      </form>
    </mat-card>
  `,
  styles: [`
    .entity-form {
      display: grid;
      gap: 1rem;
      max-width: 42rem;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
    }
  `]
})
export class ProductFormPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly productFormFactory = inject(ProductFormFactory);
  private readonly productsApi = inject(ProductsApiService);
  private readonly notifications = inject(NotificationService);

  protected readonly submitting = signal(false);
  protected readonly productId = Number(this.route.snapshot.paramMap.get('id') ?? 0);
  protected readonly isEdit = computed(() => !!this.productId);
  protected readonly pageTitle = computed(() => this.isEdit() ? 'Editar producto' : 'Crear producto');
  protected readonly form = this.productFormFactory.create();

  constructor() {
    if (this.isEdit()) {
      void this.load();
    }
  }

  protected async load(): Promise<void> {
    try {
      const product = await firstValueFrom(this.productsApi.getById(this.productId));
      this.form.reset({
        sku: product.sku,
        name: product.name,
        description: product.description ?? '',
        price: product.price
      });
    } catch (error) {
      this.notifications.error(extractApiError(error).message);
      await this.router.navigate(['/app/products']);
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
        ...this.form.getRawValue(),
        description: this.form.getRawValue().description || null
      };

      if (this.isEdit()) {
        await firstValueFrom(this.productsApi.update(this.productId, payload));
        this.notifications.success('Producto actualizado');
      } else {
        await firstValueFrom(this.productsApi.create(payload));
        this.notifications.success('Producto creado');
      }

      await this.router.navigate(['/app/products']);
    } catch (error) {
      const apiError = extractApiError(error);
      applyServerFieldErrors(this.form, apiError.fieldErrors);
      this.notifications.error(apiError.message);
    } finally {
      this.submitting.set(false);
    }
  }

  protected cancel(): void {
    void this.router.navigate(['/app/products']);
  }
}
