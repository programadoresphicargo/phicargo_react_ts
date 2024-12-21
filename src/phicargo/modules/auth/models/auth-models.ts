export type Role =
  | 'Contabilidad'
  | 'Desarrollador'
  | 'Dirección'
  | 'Ejecutivo'
  | 'Invitado'
  | 'Monitorista'
  | 'Sistema'
  | 'Supervisor'
  | 'Vigilancia'
  | 'Administrador'


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

export interface FullUser extends User {
  password: string;
  pin: string;
}

export interface Session {
  user: User;
  token: Token;
}

export interface UserBasic {
  id: number;
  username: string;
}

