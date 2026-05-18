import { HttpErrorResponse } from '@angular/common/http';
import { ApiError } from '../../core/types/api-error.model';

export function extractApiError(error: unknown): ApiError {
  if (error instanceof HttpErrorResponse) {
    if (typeof error.error === 'object' && error.error?.message) {
      return error.error as ApiError;
    }

    return {
      status: error.status,
      message: error.message || 'Request failed'
    };
  }

  return {
    message: 'Unexpected error'
  };
}
