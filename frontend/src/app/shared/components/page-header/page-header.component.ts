import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-page-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="page-header">
      <div>
        <p class="eyebrow">{{ eyebrow() }}</p>
        <h1>{{ title() }}</h1>
      </div>
      @if (description()) {
        <p class="description">{{ description() }}</p>
      }
    </header>
  `,
  styles: [`
    .page-header {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      align-items: flex-end;
      margin-bottom: 1.5rem;
    }

    .eyebrow {
      margin: 0 0 0.25rem;
      color: var(--color-primary);
      font-size: 0.8rem;
      font-weight: 800;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    h1 {
      margin: 0;
      color: var(--color-text);
      font-size: clamp(1.6rem, 2vw, 2.2rem);
      font-weight: 800;
    }

    .description {
      max-width: 34rem;
      margin: 0;
      color: var(--color-text-muted);
      line-height: 1.5;
    }
  `]
})
export class PageHeaderComponent {
  readonly eyebrow = input('Operaciones');
  readonly title = input.required<string>();
  readonly description = input('');
}
