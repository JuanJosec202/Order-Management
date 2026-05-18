import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-list-toolbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatFormFieldModule, MatInputModule],
  template: `
    <div class="toolbar">
      <mat-form-field appearance="outline" class="search-field">
        <mat-label>{{ searchPlaceholder() }}</mat-label>
        <input matInput [value]="searchValue()" (input)="searchChange.emit(($any($event.target)).value)" />
      </mat-form-field>

      <div class="actions">
        <ng-content />
      </div>
    </div>
  `,
  styles: [`
    .toolbar {
      display: flex;
      gap: 1rem;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      margin-bottom: 1rem;
      padding: 1rem 1.1rem;
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: 1rem;
    }

    .search-field {
      min-width: min(100%, 24rem);
      flex: 1 1 18rem;
    }

    .actions {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
      justify-content: flex-end;
    }
  `]
})
export class ListToolbarComponent {
  readonly searchPlaceholder = input('Buscar');
  readonly searchValue = input('');
  readonly searchChange = output<string>();
}
