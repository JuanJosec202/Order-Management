import { Injectable, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ProductResponseDto } from '../api/products-api.service';

@Injectable({ providedIn: 'root' })
export class ProductFormFactory {
  private readonly fb = inject(FormBuilder);

  create(product?: ProductResponseDto) {
    return this.fb.nonNullable.group({
      sku: [product?.sku ?? '', [Validators.required, Validators.maxLength(50)]],
      name: [product?.name ?? '', [Validators.required, Validators.maxLength(150)]],
      description: [product?.description ?? '', [Validators.maxLength(500)]],
      price: [product?.price ?? 0, [Validators.required, Validators.min(0)]]
    });
  }
}
