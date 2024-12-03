import type { Role } from '../../../auth/models';

export interface UserUpdateApi {
  usuario?: string | null;
  nombre?: string | null;
  correo?: string | null;
  tipo?: Role | null;
  estado?: string | null;
  passwoord?: string | null;
}
