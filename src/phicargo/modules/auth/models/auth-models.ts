export type Role =
  | 'Desarrollador'
  | 'Vigilancia'
  | 'Administrador'
  | 'Invitado'
  | 'Supervisor'
  | 'Contabilidad'
  | 'Monitorista'
  | 'Dirección'
  | 'Ejecutivo'
  | '';


export interface UserLogin {
  username: string;
  password: string;
}

export interface Token {
  accessToken: string;
  tokenType: string;
}

interface UserBase {
  username: string;
  name: string | null;
  email: string | null;
  role: Role | null;
  isActive: boolean;
}

export interface User extends UserBase {
  id: number;
  permissions: number[];
}

export interface Session {
  user: User;
  token: Token;
}

