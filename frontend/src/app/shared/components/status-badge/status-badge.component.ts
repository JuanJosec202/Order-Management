import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-status-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="badge" [class]="toneClass()">{{ label() }}</span>`,
  styles: [`
    .badge {
      display: inline-flex;
      align-items: center;
      padding: 0.36rem 0.78rem;
      border-radius: 999px;
      font-size: 0.78rem;
      font-weight: 800;
      letter-spacing: 0.03em;
      border: 1px solid transparent;
    }

    .neutral { background: rgba(100, 116, 139, 0.10); color: var(--color-text-muted); border-color: rgba(100, 116, 139, 0.18); }
    .success { background: rgba(34, 197, 94, 0.12); color: #15803d; border-color: rgba(34, 197, 94, 0.24); }
    .warn { background: rgba(250, 204, 21, 0.18); color: #a16207; border-color: rgba(250, 204, 21, 0.30); }
    .danger { background: rgba(220, 38, 38, 0.10); color: var(--color-danger); border-color: rgba(220, 38, 38, 0.24); }
    .info { background: rgba(56, 189, 248, 0.12); color: #0369a1; border-color: rgba(56, 189, 248, 0.24); }
  `]
})
export class StatusBadgeComponent {
  readonly label = input.required<string>();
  readonly tone = input<'neutral' | 'success' | 'warn' | 'danger' | 'info'>('neutral');
  readonly toneClass = computed(() => this.tone());
}
