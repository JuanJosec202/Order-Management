import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { FormErrorComponent } from '../../../shared/components/form-error/form-error.component';
import { NotificationService } from '../../../core/services/notification.service';
import { UsersApiService } from '../api/users-api.service';
import { UserFormFactory } from '../application/user-form.factory';
import { applyServerFieldErrors } from '../../../shared/utils/form.util';
import { extractApiError } from '../../../shared/utils/api-error.util';

@Component({
  selector: 'app-user-form-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    PageHeaderComponent,
    FormErrorComponent
  ],
  template: `
    <app-page-header
      eyebrow="Administración"
      [title]="pageTitle()"
      description="Provisiona credenciales y roles usados por los endpoints protegidos del backend." />

    <mat-card appearance="outlined">
      <form class="entity-form" [formGroup]="form" (ngSubmit)="submit()">
        <mat-form-field appearance="outline">
          <mat-label>Nombre</mat-label>
          <input matInput formControlName="name" />
          <app-form-error [control]="form.controls.name" />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Correo</mat-label>
          <input matInput type="email" formControlName="email" />
          <app-form-error [control]="form.controls.email" />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Contraseña</mat-label>
          <input matInput type="password" formControlName="password" />
          <app-form-error [control]="form.controls.password" />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Rol</mat-label>
          <mat-select formControlName="role">
            @for (role of availableRoles; track role) {
              <mat-option [value]="role">{{ role }}</mat-option>
            }
          </mat-select>
          <app-form-error [control]="form.controls.role" />
        </mat-form-field>

        <mat-checkbox formControlName="active">Activo</mat-checkbox>

        <div class="form-actions">
          <button mat-button type="button" (click)="cancel()">Cancelar</button>
          <button mat-flat-button type="submit" [disabled]="form.invalid || submitting()">
            {{ submitting() ? 'Guardando...' : 'Guardar usuario' }}
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
export class UserFormPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly usersApi = inject(UsersApiService);
  private readonly userFormFactory = inject(UserFormFactory);
  private readonly notifications = inject(NotificationService);

  protected readonly availableRoles = this.userFormFactory.availableRoles;
  protected readonly userId = Number(this.route.snapshot.paramMap.get('id') ?? 0);
  protected readonly isEdit = computed(() => !!this.userId);
  protected readonly pageTitle = computed(() => this.isEdit() ? 'Editar usuario' : 'Crear usuario');
  protected readonly submitting = signal(false);
  protected readonly form = this.userFormFactory.create();

  constructor() {
    if (this.isEdit()) {
      void this.load();
    }
  }

  protected async load(): Promise<void> {
    try {
      const user = await firstValueFrom(this.usersApi.getById(this.userId));
      this.form.reset({
        name: user.name,
        email: user.email,
        password: '',
        role: user.role,
        active: user.active
      });
    } catch (error) {
      this.notifications.error(extractApiError(error).message);
      await this.router.navigate(['/app/users']);
    }
  }

  protected async submit(): Promise<void> {
    if (this.form.invalid || this.submitting()) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    try {
      const payload = this.form.getRawValue();
      if (this.isEdit()) {
        await firstValueFrom(this.usersApi.update(this.userId, payload));
        this.notifications.success('Usuario actualizado');
      } else {
        await firstValueFrom(this.usersApi.create(payload));
        this.notifications.success('Usuario creado');
      }

      await this.router.navigate(['/app/users']);
    } catch (error) {
      const apiError = extractApiError(error);
      applyServerFieldErrors(this.form, apiError.fieldErrors);
      this.notifications.error(apiError.message);
    } finally {
      this.submitting.set(false);
    }
  }

  protected cancel(): void {
    void this.router.navigate(['/app/users']);
  }
}
