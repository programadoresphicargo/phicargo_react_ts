import type {
  FullUser,
  FullUserApi,
  Session,
  SessionApi,
  Token,
  TokenApi,
  User,
  UserApi,
} from '../models';

/**
 * Mapper to convert user data from API to local model
 * @param user Object with user data
 * @returns Obect with user data
 */
export const userToLocal = (user: UserApi): User => ({
  id: user.id_usuario,
  username: user.usuario,
  name: user.nombre,
  email: user.correo,
  role: user.tipo,
  isActive: user.estado === 'Activo',
  permissions: user.permissions_user_ids,
});

/**
 * Mapper to convert full user data from API to local model
 * @param user Object with user data from API
 * @returns Object with user data
 */
export const fullUserToLocal = (user: FullUserApi): FullUser => ({
  ...userToLocal(user),
  password: user.passwoord,
  pin: user.pin,
});

/**
 * Mapper to convert token data from API to local model
 * @param token Token data from API
 * @returns Object with token data
 */
const tokenToLocal = (token: TokenApi): Token => ({
  accessToken: token.access_token,
  tokenType: token.token_type,
});

/**
 * Mapper to convert session data from API to local model
 * @param session Object with session data from API
 * @returns Object with session data
 */
export const sessionToLocal = (session: SessionApi): Session => ({
  user: userToLocal(session.user),
  token: tokenToLocal(session.token),
});

