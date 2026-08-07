import { Role } from "../../auth/models";

export interface UserUpdate {
  username: string;
  name: string;
  email: string;
  role: Role;
  isActive: boolean;
  password: string;
  pin: string;
  id_odoo: number | null
  store_ids: number[]
}

export interface UserCreate {
  username: string;
  name: string;
  email: string;
  role: Role;
  isActive: boolean;
  password: string;
  pin: string | null;
}

export interface UserRead {
  id: number;
  name: string | null;
  username: string | null;
}
