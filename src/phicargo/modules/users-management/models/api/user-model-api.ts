import type { Role } from '../../../auth/models';

export interface UserUpdateApi {
  usuario?: string | null;
  nombre?: string | null;
  correo?: string | null;
  tipo?: Role | null;
  estado?: string | null;
  passwoord?: string | null;
  pin?: string | null;
}

export interface UserCreateApi {
  usuario: string;
  nombre: string;
  correo: string;
  tipo: Role;
  estado: 'Activo' | 'Inactivo';
  passwoord: string;
  pin?: string | null;
}

export interface UserReadApi {
  id_usuario: number;
  nombre: string | null;
  usuario: string | null;
}
