import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { AuthSessionService } from '../auth/auth-session.service';

@Component({
  selector: 'app-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatButtonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatCardModule
  ],
  template: `
    <mat-sidenav-container class="shell">
      <mat-sidenav mode="side" opened class="shell-nav">
        <div class="brand">
          <p>OrderManagement</p>
          <span>Consola de operaciones</span>
        </div>

        <mat-nav-list>
          @for (item of navItems(); track item.link) {
            <a
              mat-list-item
              [routerLink]="item.link"
              routerLinkActive="active-link"
              [routerLinkActiveOptions]="{ exact: item.exact ?? false }">
              {{ item.label }}
            </a>
          }
        </mat-nav-list>

        <div class="nav-footer">
          <p>{{ authSession.session()?.email }}</p>
          <span>{{ authSession.currentRole() }}</span>
          <button mat-stroked-button type="button" (click)="logout()">Cerrar sesión</button>
        </div>
      </mat-sidenav>

      <mat-sidenav-content>
        <mat-toolbar class="shell-toolbar">
          <div class="toolbar-copy">
            <strong>Centro de operaciones</strong>
            <span>Monitorea catálogo, stock, usuarios, órdenes y pagos desde un solo panel</span>
          </div>
        </mat-toolbar>

        <main class="shell-content">
          <router-outlet />
        </main>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .shell {
      min-height: 100vh;
      background:
        radial-gradient(circle at top right, rgba(56, 189, 248, 0.12), transparent 25%),
        linear-gradient(180deg, #f8fafc 0%, #eef3f9 100%);
    }

    .shell-nav {
      width: 280px;
      padding: 1.5rem 1rem;
      border-right: 1px solid var(--color-border);
      background:
        radial-gradient(circle at top left, rgba(56, 189, 248, 0.12), transparent 40%),
        linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
    }

    .brand {
      padding: 0 0.75rem 1.5rem;
    }

    .brand p {
      margin: 0;
      color: var(--color-primary);
      font-size: 1.45rem;
      font-weight: 800;
    }

    .brand span,
    .nav-footer span,
    .shell-toolbar span {
      color: var(--color-text-muted);
      font-size: 0.9rem;
    }

    .active-link {
      background: rgba(30, 58, 138, 0.08);
      border-radius: 0.85rem;
      color: var(--color-primary);
      font-weight: 700;
    }

    mat-nav-list a,
    mat-nav-list a span,
    .shell-nav .mdc-list-item__primary-text {
      font-family: 'Montserrat', 'Segoe UI', sans-serif !important;
      color: var(--color-text) !important;
      font-weight: 600;
    }

    .nav-footer {
      position: absolute;
      left: 1rem;
      right: 1rem;
      bottom: 1.5rem;
      display: grid;
      gap: 0.35rem;
      padding: 1rem;
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: 1rem;
    }

    .nav-footer p {
      margin: 0;
      font-weight: 600;
      color: var(--color-text);
      overflow-wrap: anywhere;
    }

    .shell-toolbar {
      height: auto;
      padding: 1.25rem 2rem;
      background: rgba(255, 255, 255, 0.72);
      border-bottom: 1px solid var(--color-border);
      backdrop-filter: blur(10px);
    }

    .toolbar-copy {
      display: grid;
    }

    .toolbar-copy strong {
      color: var(--color-text);
      font-size: 1rem;
      font-weight: 800;
    }

    .shell-content {
      padding: 2rem;
    }

    @media (max-width: 960px) {
      .shell-nav {
        width: 240px;
      }

      .shell-content {
        padding: 1rem;
      }
    }
  `]
})
export class AppShellComponent {
  protected readonly authSession = inject(AuthSessionService);
  private readonly router = inject(Router);
  private readonly baseItems = signal([
    { label: 'Resumen', link: '/app/dashboard', exact: true },
    { label: 'Productos', link: '/app/products' },
    { label: 'Inventario', link: '/app/inventory' },
    { label: 'Órdenes', link: '/app/orders' },
    { label: 'Pagos', link: '/app/payments' }
  ]);

  protected readonly navItems = computed(() => {
    const items = [...this.baseItems()];
    if (this.authSession.currentRole() === 'ADMIN') {
      items.push({ label: 'Usuarios', link: '/app/users' });
    }
    return items;
  });

  protected logout(): void {
    this.authSession.clear();
    void this.router.navigate(['/login']);
  }
}
