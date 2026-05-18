import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
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
import { NotificationService } from '../../../core/services/notification.service';
import { UsersApiService, UserResponseDto } from '../api/users-api.service';
import { extractApiError } from '../../../shared/utils/api-error.util';

@Component({
  selector: 'app-users-list-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
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
      eyebrow="Administración"
      title="Usuarios"
      description="Administra cuentas y asignaciones de rol usadas por la autenticación JWT." />

    <app-list-toolbar
      searchPlaceholder="Buscar por nombre, correo o rol"
      [searchValue]="searchTerm()"
      (searchChange)="updateSearch($event)">
      <a mat-flat-button routerLink="/app/users/new">Crear usuario</a>
      <button mat-stroked-button type="button" (click)="load()">Actualizar</button>
    </app-list-toolbar>

    @if (filteredUsers().length) {
      <mat-card appearance="outlined">
        <table mat-table [dataSource]="pagedUsers()" class="data-table">
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Nombre</th>
            <td mat-cell *matCellDef="let user">{{ user.name }}</td>
          </ng-container>

          <ng-container matColumnDef="email">
            <th mat-header-cell *matHeaderCellDef>Correo</th>
            <td mat-cell *matCellDef="let user">{{ user.email }}</td>
          </ng-container>

          <ng-container matColumnDef="role">
            <th mat-header-cell *matHeaderCellDef>Rol</th>
            <td mat-cell *matCellDef="let user">
              <app-status-badge [label]="user.role" [tone]="user.role === 'ADMIN' ? 'info' : 'neutral'" />
            </td>
          </ng-container>

          <ng-container matColumnDef="active">
            <th mat-header-cell *matHeaderCellDef>Estado</th>
            <td mat-cell *matCellDef="let user">
              <app-status-badge [label]="user.active ? 'ACTIVO' : 'INACTIVO'" [tone]="user.active ? 'success' : 'warn'" />
            </td>
          </ng-container>

          <ng-container matColumnDef="updatedAt">
            <th mat-header-cell *matHeaderCellDef>Actualizado</th>
            <td mat-cell *matCellDef="let user">{{ user.updatedAt | date:'medium' }}</td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef></th>
            <td mat-cell *matCellDef="let user">
              <a mat-button [routerLink]="['/app/users', user.id, 'edit']">Editar</a>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>

        <app-simple-paginator
          [page]="page()"
          [pageSize]="pageSize"
          [totalItems]="filteredUsers().length"
          (previous)="previousPage()"
          (next)="nextPage()" />
      </mat-card>
    } @else {
      <app-empty-state
        [title]="users().length ? 'Ningún usuario coincide con el filtro' : 'No se encontraron usuarios'"
        [description]="users().length ? 'Prueba otro término de búsqueda o limpia el filtro.' : 'Crea usuarios administrativos para que el equipo pueda autenticarse contra la API.'" />
    }
  `,
  styles: [`
    .data-table {
      width: 100%;
    }
  `]
})
export class UsersListPageComponent {
  private readonly usersApi = inject(UsersApiService);
  private readonly notifications = inject(NotificationService);

  protected readonly displayedColumns = ['name', 'email', 'role', 'active', 'updatedAt', 'actions'];
  protected readonly pageSize = 6;
  protected readonly users = signal<UserResponseDto[]>([]);
  protected readonly searchTerm = signal('');
  protected readonly page = signal(1);
  protected readonly filteredUsers = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    if (!term) {
      return this.users();
    }

    return this.users().filter((user) =>
      [user.name, user.email, user.role].some((value) => value.toLowerCase().includes(term))
    );
  });
  protected readonly pagedUsers = computed(() => {
    const page = this.page();
    const start = (page - 1) * this.pageSize;
    return this.filteredUsers().slice(start, start + this.pageSize);
  });

  constructor() {
    void this.load();
  }

  protected async load(): Promise<void> {
    try {
      this.users.set(await firstValueFrom(this.usersApi.list()));
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
    const totalPages = Math.max(1, Math.ceil(this.filteredUsers().length / this.pageSize));
    this.page.update((page) => Math.min(totalPages, page + 1));
  }
}
