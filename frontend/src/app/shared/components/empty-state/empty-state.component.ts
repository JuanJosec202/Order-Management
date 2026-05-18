import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="empty-state">
      <h3>{{ title() }}</h3>
      <p>{{ description() }}</p>
    </section>
  `,
  styles: [`
    .empty-state {
      padding: 2rem;
      border: 1px dashed var(--color-border);
      border-radius: 1rem;
      background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
      text-align: center;
      color: var(--color-text-muted);
    }

    h3 {
      margin: 0 0 0.5rem;
      color: var(--color-text);
      font-weight: 800;
    }

    p {
      margin: 0;
    }
  `]
})
export class EmptyStateComponent {
  readonly title = input.required<string>();
  readonly description = input.required<string>();
}
