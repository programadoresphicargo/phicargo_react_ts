import type { Session, SessionApi, Token, TokenApi, User, UserApi } from '../models';

export const userToLocal = (user: UserApi): User => ({
  id: user.id_usuario,
  username: user.usuario,
  name: user.nombre,
  email: user.correo,
  role: user.tipo,
  isActive: user.estado === 'Activo',
  permissions: user.permissions_user_ids,
});

const tokenToLocal = (token: TokenApi): Token => ({
  accessToken: token.access_token,
  tokenType: token.token_type,
});

export const sessionToLocal = (session: SessionApi): Session => ({
  user: userToLocal(session.user),
  token: tokenToLocal(session.token),
});
