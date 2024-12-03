import { Role } from "../auth-models";

export interface TokenApi {
  access_token: string;
  token_type: string;
}

interface UserBaseApi {
  usuario: string;
  nombre: string | null;
  correo: string | null;
  tipo: Role | null;
  estado: string | null;
}

export interface UserApi extends UserBaseApi {
  id_usuario: number;
  permissions_user_ids: number[];
}

export interface SessionApi {
  user: UserApi;
  token: TokenApi;
}
