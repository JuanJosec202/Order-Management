import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { ListToolbarComponent } from '../../../shared/components/list-toolbar/list-toolbar.component';
import { SimplePaginatorComponent } from '../../../shared/components/simple-paginator/simple-paginator.component';
import { OrdersApiService, OrderResponseDto } from '../api/orders-api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { extractApiError } from '../../../shared/utils/api-error.util';

@Component({
  selector: 'app-orders-list-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    CurrencyPipe,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    PageHeaderComponent,
    EmptyStateComponent,
    StatusBadgeComponent,
    ListToolbarComponent,
    SimplePaginatorComponent
  ],
  template: `
    <app-page-header
      eyebrow="Ventas"
      title="Órdenes"
      description="Crea órdenes desde el catálogo de productos y revisa su estado persistido." />

    <app-list-toolbar
      searchPlaceholder="Buscar por id de orden, estado o creador"
      [searchValue]="searchTerm()"
      (searchChange)="updateSearch($event)">
      <a mat-flat-button routerLink="/app/orders/new">Crear orden</a>
      <button mat-stroked-button type="button" (click)="load()">Actualizar</button>
    </app-list-toolbar>

    @if (filteredOrders().length) {
      <mat-card appearance="outlined">
        <table mat-table [dataSource]="pagedOrders()" class="data-table">
          <ng-container matColumnDef="id">
            <th mat-header-cell *matHeaderCellDef>ID</th>
            <td mat-cell *matCellDef="let order">#{{ order.id }}</td>
          </ng-container>

          <ng-container matColumnDef="items">
            <th mat-header-cell *matHeaderCellDef>Ítems</th>
            <td mat-cell *matCellDef="let order">{{ order.items.length }}</td>
          </ng-container>

          <ng-container matColumnDef="total">
            <th mat-header-cell *matHeaderCellDef>Total</th>
            <td mat-cell *matCellDef="let order">{{ order.totalAmount | currency }}</td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Estado</th>
            <td mat-cell *matCellDef="let order">
              <app-status-badge
                [label]="order.status"
                [tone]="order.status === 'PAID' ? 'success' : order.status === 'CANCELLED' ? 'danger' : 'info'" />
            </td>
          </ng-container>

          <ng-container matColumnDef="createdAt">
            <th mat-header-cell *matHeaderCellDef>Creada</th>
            <td mat-cell *matCellDef="let order">{{ order.createdAt | date:'medium' }}</td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef></th>
            <td mat-cell *matCellDef="let order">
              <a mat-button [routerLink]="['/app/orders', order.id]">Abrir</a>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>

        <app-simple-paginator
          [page]="page()"
          [pageSize]="pageSize"
          [totalItems]="filteredOrders().length"
          (previous)="previousPage()"
          (next)="nextPage()" />
      </mat-card>
    } @else {
      <app-empty-state
        [title]="orders().length ? 'Ninguna orden coincide con el filtro' : 'Aún no hay órdenes'"
        [description]="orders().length ? 'Prueba otro término de búsqueda o limpia el filtro.' : 'Crea una orden cuando ya existan productos y stock.'" />
    }
  `,
  styles: [`
    .data-table {
      width: 100%;
    }
  `]
})
export class OrdersListPageComponent {
  private readonly ordersApi = inject(OrdersApiService);
  private readonly notifications = inject(NotificationService);

  protected readonly displayedColumns = ['id', 'items', 'total', 'status', 'createdAt', 'actions'];
  protected readonly pageSize = 6;
  protected readonly orders = signal<OrderResponseDto[]>([]);
  protected readonly searchTerm = signal('');
  protected readonly page = signal(1);
  protected readonly filteredOrders = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    if (!term) {
      return this.orders();
    }

    return this.orders().filter((order) =>
      [String(order.id), order.status, order.createdBy ?? ''].some((value) =>
        value.toLowerCase().includes(term)
      )
    );
  });
  protected readonly pagedOrders = computed(() => {
    const page = this.page();
    const start = (page - 1) * this.pageSize;
    return this.filteredOrders().slice(start, start + this.pageSize);
  });

  constructor() {
    void this.load();
  }

  protected async load(): Promise<void> {
    try {
      this.orders.set(await firstValueFrom(this.ordersApi.list()));
      this.page.set(1);
    } catch (error) {
      this.notifications.error(extractApiError(error).message);
    }
  }

  protected updateSearch(value: string): void {
    this.searchTerm.set(value);
    this.page.set(1);
  }

  protected previousPage(): void {
    this.page.update((page) => Math.max(1, page - 1));
  }

  protected nextPage(): void {
    const totalPages = Math.max(1, Math.ceil(this.filteredOrders().length / this.pageSize));
    this.page.update((page) => Math.min(totalPages, page + 1));
  }
}
