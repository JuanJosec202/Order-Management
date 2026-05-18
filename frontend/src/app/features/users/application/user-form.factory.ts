import { Injectable, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UserResponseDto } from '../api/users-api.service';
import { UserRole } from '../../../shared/models/domain.models';

@Injectable({ providedIn: 'root' })
export class UserFormFactory {
  private readonly fb = inject(FormBuilder);
  readonly availableRoles: UserRole[] = ['ADMIN', 'MANAGER', 'OPERATOR'];

  create(user?: UserResponseDto) {
    return this.fb.nonNullable.group({
      name: [user?.name ?? '', [Validators.required, Validators.maxLength(150)]],
      email: [user?.email ?? '', [Validators.required, Validators.email, Validators.maxLength(255)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(255)]],
      role: [user?.role ?? 'OPERATOR' as UserRole, [Validators.required]],
      active: [user?.active ?? true]
    });
  }
}
