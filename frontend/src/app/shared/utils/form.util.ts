import { AbstractControl, FormGroup } from '@angular/forms';

export function controlErrorMessage(control: AbstractControl | null, serverError?: string | null): string | null {
  if (serverError) {
    return serverError;
  }

  if (!control || !control.errors || !(control.dirty || control.touched)) {
    return null;
  }

  if (control.errors['required']) {
    return 'Este campo es obligatorio';
  }
  if (control.errors['email']) {
    return 'Ingresa un correo válido';
  }
  if (control.errors['min']) {
    return `El valor mínimo es ${control.errors['min'].min}`;
  }
  if (control.errors['minlength']) {
    return `La longitud mínima es ${control.errors['minlength'].requiredLength}`;
  }
  if (control.errors['maxlength']) {
    return `La longitud máxima es ${control.errors['maxlength'].requiredLength}`;
  }
  if (control.errors['server']) {
    return control.errors['server'];
  }

  return 'Valor inválido';
}

export function applyServerFieldErrors(form: FormGroup, fieldErrors?: Record<string, string>): void {
  if (!fieldErrors) {
    return;
  }

  for (const [field, message] of Object.entries(fieldErrors)) {
    const control = form.get(field);
    if (!control) {
      continue;
    }

    control.setErrors({
      ...(control.errors ?? {}),
      server: message
    });
    control.markAsTouched();
  }
}
