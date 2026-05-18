import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-simple-paginator',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule],
  template: `
    @if (totalItems() > 0) {
      <div class="paginator">
        <p>
          Mostrando {{ rangeStart() }}-{{ rangeEnd() }} de {{ totalItems() }}
        </p>

        <div class="actions">
          <button mat-stroked-button type="button" (click)="previous.emit()" [disabled]="page() <= 1">
            Anterior
          </button>
          <span>Página {{ page() }} / {{ totalPages() }}</span>
          <button mat-stroked-button type="button" (click)="next.emit()" [disabled]="page() >= totalPages()">
            Siguiente
          </button>
        </div>
      </div>
    }
  `,
  styles: [`
    .paginator {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      align-items: center;
      flex-wrap: wrap;
      margin-top: 1rem;
      color: var(--color-text-muted);
      padding-top: 0.75rem;
      border-top: 1px solid var(--color-border);
    }

    .actions {
      display: flex;
      gap: 0.75rem;
      align-items: center;
      flex-wrap: wrap;
    }

    p {
      margin: 0;
    }
  `]
})
export class SimplePaginatorComponent {
  readonly page = input.required<number>();
  readonly pageSize = input.required<number>();
  readonly totalItems = input.required<number>();
  readonly previous = output<void>();
  readonly next = output<void>();

  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.totalItems() / this.pageSize())));
  readonly rangeStart = computed(() => ((this.page() - 1) * this.pageSize()) + 1);
  readonly rangeEnd = computed(() => Math.min(this.page() * this.pageSize(), this.totalItems()));
}
