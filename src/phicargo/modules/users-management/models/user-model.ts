import { Role } from "../../auth/models";

export interface UserUpdate {
  username: string;
  name: string;
  email: string;
  role: Role;
  isActive: boolean;
  password: string;
}
