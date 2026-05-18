import { UserRole } from '../../shared/models/domain.models';

export interface AuthSession {
  token: string;
  email: string;
  role: UserRole;
  userId: number;
  expiresAt?: number;
}
