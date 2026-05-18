import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-dashboard-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, MatButtonModule, MatCardModule, PageHeaderComponent],
  template: `
    <app-page-header
      eyebrow="Panel"
      title="Resumen de operaciones"
      description="Usa esta consola para operar los flujos del backend con visibilidad directa sobre catálogo, stock, órdenes y pagos." />

    <section class="card-grid">
      @for (card of cards; track card.link) {
        <mat-card appearance="outlined" class="dashboard-card">
          <h3>{{ card.title }}</h3>
          <p>{{ card.description }}</p>
          <a mat-stroked-button [routerLink]="card.link">Abrir</a>
        </mat-card>
      }
    </section>
  `,
  styles: [`
    .card-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1rem;
    }

    .dashboard-card {
      display: grid;
      gap: 1rem;
      min-height: 220px;
      border-radius: 1.25rem;
      background: linear-gradient(180deg, #ffffff 0%, #f6fafc 100%);
      padding: 20px;
    }

    h3 {
      margin: 0;
      color: var(--color-text);
    }

    p {
      margin: 0;
      color: var(--color-text-muted);
      line-height: 1.5;
    }

    a {
      justify-self: start;
      margin-top: auto;
    }
  `]
})
export class DashboardPageComponent {
  protected readonly cards = [
    { title: 'Productos', description: 'Crea y mantiene el catálogo consumido por las órdenes.', link: '/app/products' },
    { title: 'Inventario', description: 'Inspecciona el stock actual y aplica ajustes controlados.', link: '/app/inventory' },
    { title: 'Órdenes', description: 'Crea órdenes y revisa sus líneas y transiciones de estado.', link: '/app/orders' },
    { title: 'Pagos', description: 'Revisa intentos de pago y simula aprobaciones o rechazos.', link: '/app/payments' },
    { title: 'Usuarios', description: 'Mantén usuarios y roles administrativos.', link: '/app/users' }
  ];
}
