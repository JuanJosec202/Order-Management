import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { ListToolbarComponent } from '../../../shared/components/list-toolbar/list-toolbar.component';
import { SimplePaginatorComponent } from '../../../shared/components/simple-paginator/simple-paginator.component';
import { NotificationService } from '../../../core/services/notification.service';
import { ProductsApiService, ProductResponseDto } from '../api/products-api.service';
import { extractApiError } from '../../../shared/utils/api-error.util';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-products-list-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    DatePipe,
    CurrencyPipe,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    PageHeaderComponent,
    EmptyStateComponent,
    ListToolbarComponent,
    SimplePaginatorComponent
  ],
  template: `
    <app-page-header
      eyebrow="Catálogo"
      title="Productos"
      description="Administra el catálogo expuesto a la creación de órdenes y a las operaciones de stock." />

    <app-list-toolbar
      searchPlaceholder="Buscar por SKU, nombre o descripción"
      [searchValue]="searchTerm()"
      (searchChange)="updateSearch($event)">
      <a mat-flat-button routerLink="/app/products/new">Crear producto</a>
      <button mat-stroked-button type="button" (click)="load()">Actualizar</button>
    </app-list-toolbar>

    @if (filteredProducts().length) {
      <mat-card appearance="outlined">
        <table mat-table [dataSource]="pagedProducts()" class="data-table">
          <ng-container matColumnDef="sku">
            <th mat-header-cell *matHeaderCellDef>SKU</th>
            <td mat-cell *matCellDef="let product">{{ product.sku }}</td>
          </ng-container>

          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Nombre</th>
            <td mat-cell *matCellDef="let product">{{ product.name }}</td>
          </ng-container>

          <ng-container matColumnDef="price">
            <th mat-header-cell *matHeaderCellDef>Precio</th>
            <td mat-cell *matCellDef="let product">{{ product.price | currency }}</td>
          </ng-container>

          <ng-container matColumnDef="updatedAt">
            <th mat-header-cell *matHeaderCellDef>Actualizado</th>
            <td mat-cell *matCellDef="let product">{{ product.updatedAt | date:'medium' }}</td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef></th>
            <td mat-cell *matCellDef="let product">
              <a mat-button [routerLink]="['/app/products', product.id, 'edit']">Editar</a>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>

        <app-simple-paginator
          [page]="page()"
          [pageSize]="pageSize"
          [totalItems]="filteredProducts().length"
          (previous)="previousPage()"
          (next)="nextPage()" />
      </mat-card>
    } @else {
      <app-empty-state
        [title]="products().length ? 'Ningún producto coincide con el filtro' : 'Aún no hay productos'"
        [description]="products().length ? 'Prueba otro término de búsqueda o limpia el filtro actual.' : 'Crea tu primer producto para empezar a gestionar catálogo y stock.'" />
    }
  `,
  styles: [`
    .data-table {
      width: 100%;
    }
  `]
})
export class ProductsListPageComponent {
  private readonly productsApi = inject(ProductsApiService);
  private readonly notifications = inject(NotificationService);

  protected readonly displayedColumns = ['sku', 'name', 'price', 'updatedAt', 'actions'];
  protected readonly pageSize = 6;
  protected readonly products = signal<ProductResponseDto[]>([]);
  protected readonly searchTerm = signal('');
  protected readonly page = signal(1);
  protected readonly filteredProducts = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    if (!term) {
      return this.products();
    }

    return this.products().filter((product) =>
      [product.sku, product.name, product.description ?? ''].some((value) =>
        value.toLowerCase().includes(term)
      )
    );
  });
  protected readonly pagedProducts = computed(() => {
    const page = this.page();
    const start = (page - 1) * this.pageSize;
    return this.filteredProducts().slice(start, start + this.pageSize);
  });

  constructor() {
    void this.load();
  }

  protected async load(): Promise<void> {
    try {
      this.products.set(await firstValueFrom(this.productsApi.list()));
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
    const totalPages = Math.max(1, Math.ceil(this.filteredProducts().length / this.pageSize));
    this.page.update((page) => Math.min(totalPages, page + 1));
  }
}
