import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { controlErrorMessage } from '../../utils/form.util';

@Component({
  selector: 'app-form-error',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (message) {
      <small class="form-error">{{ message }}</small>
    }
  `,
  styles: [`
    .form-error {
      display: block;
      margin-top: 0.35rem;
      color: #ac2d27;
    }
  `]
})
export class FormErrorComponent {
  readonly control = input<AbstractControl | null>(null);
  readonly serverError = input<string | null>(null);

  get message(): string | null {
    return controlErrorMessage(this.control(), this.serverError());
  }
}
