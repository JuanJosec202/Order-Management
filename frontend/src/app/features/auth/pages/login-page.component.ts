import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { firstValueFrom } from 'rxjs';
import { AuthApiService } from '../api/auth-api.service';
import { AuthSessionService } from '../../../core/auth/auth-session.service';
import { NotificationService } from '../../../core/services/notification.service';
import { FormErrorComponent } from '../../../shared/components/form-error/form-error.component';
import { extractApiError } from '../../../shared/utils/api-error.util';

@Component({
  selector: 'app-login-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormErrorComponent
  ],
  template: `
    <section class="login-shell">
      <mat-card class="login-card" appearance="outlined">
        <div class="copy">
          <p class="eyebrow">Angular 21 Frontend</p>
          <h1>Consola OrderManagement</h1>
          <p>
            Inicia sesión con un usuario del backend para controlar productos, inventario, órdenes, pagos y usuarios desde un solo lugar.
          </p>
        </div>

        <form class="login-form" [formGroup]="form" (ngSubmit)="submit()">
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

          <button mat-flat-button type="submit" [disabled]="form.invalid || submitting()">
            {{ submitting() ? 'Ingresando...' : 'Ingresar' }}
          </button>
        </form>
      </mat-card>
    </section>
  `,
  styles: [`
    .login-shell {
      min-height: 100vh;
      display: grid;
      place-items: center;
      padding: 1.5rem;
      background:
        radial-gradient(circle at 15% 15%, rgba(56, 189, 248, 0.22), transparent 24%),
        radial-gradient(circle at 85% 20%, rgba(30, 58, 138, 0.18), transparent 20%),
        linear-gradient(180deg, #0f172a 0%, #1e3a8a 38%, #f8fafc 38%, #f8fafc 100%);
    }

    .login-card {
      width: min(100%, 28rem);
      padding: 2rem;
      border-radius: 1.5rem;
      border-color: rgba(255, 255, 255, 0.7);
    }

    .copy {
      margin-bottom: 1.5rem;
    }

    .eyebrow {
      margin: 0 0 0.5rem;
      color: var(--color-primary);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-weight: 800;
      font-size: 0.8rem;
    }

    h1 {
      margin: 0 0 0.5rem;
      color: var(--color-text);
      font-size: 2rem;
      font-weight: 800;
    }

    .copy p:last-child {
      margin: 0;
      color: var(--color-text-muted);
      line-height: 1.5;
    }

    .login-form {
      display: grid;
      gap: 1rem;
    }

    button {
      height: 3rem;
      margin-top: 0.25rem;
      font-weight: 700;
    }
  `]
})
export class LoginPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authApi = inject(AuthApiService);
  private readonly authSession = inject(AuthSessionService);
  private readonly notifications = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly submitting = signal(false);
  protected readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  protected async submit(): Promise<void> {
    if (this.form.invalid || this.submitting()) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    try {
      const response = await firstValueFrom(this.authApi.login(this.form.getRawValue()));
      this.authSession.storeToken(response.accessToken);
      this.notifications.success('Sesión iniciada');

      const redirectTo = this.route.snapshot.queryParamMap.get('redirectTo') || '/app/dashboard';
      await this.router.navigateByUrl(redirectTo);
    } catch (error) {
      this.notifications.error(extractApiError(error).message);
    } finally {
      this.submitting.set(false);
    }
  }
}
