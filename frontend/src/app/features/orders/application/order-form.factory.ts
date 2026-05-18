import { Injectable, inject } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class OrderFormFactory {
  private readonly fb = inject(FormBuilder);

  create() {
    return this.fb.group({
      items: this.fb.array([this.createItem()])
    });
  }

  createItem() {
    return this.fb.nonNullable.group({
      productId: [0, [Validators.required, Validators.min(1)]],
      quantity: [1, [Validators.required, Validators.min(1)]]
    });
  }

  items(form: ReturnType<OrderFormFactory['create']>): FormArray {
    return form.controls.items as FormArray;
  }
}
