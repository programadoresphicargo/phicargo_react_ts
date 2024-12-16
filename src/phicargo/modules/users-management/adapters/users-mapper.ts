import type { UserCreate, UserCreateApi, UserUpdate, UserUpdateApi } from '../models';

/**
 * Mapper que convierte un objeto con la información del usuario en el formato de la API
 * @param user Objeto con la información del usuario
 * @returns Objeto con la información del usuario en el formato de la API
 */
export const userUpdateToApi = (user: UserUpdate): UserUpdateApi => {
  const userApi: UserUpdateApi = {};

  if (user.username) {
    userApi.usuario = user.username;
  }

  if (user.name) {
    userApi.nombre = user.name;
  }

  if (user.email) {
    userApi.correo = user.email;
  }

  if (user.role) {
    userApi.tipo = user.role;
  }

  if (typeof user?.isActive === 'boolean') {
    userApi.estado = user.isActive ? 'Activo' : 'Inactivo';
  }

  if (user.password) {
    userApi.passwoord = user.password;
  }

  if (user.pin) {
    userApi.pin = user.pin;
  }

  return userApi;
};

/**
 * Mapper that converts an object with the user information to the API format
 * @param user Object with the user information
 * @returns Object with the user information in the API format
 */
export const userToApi = (user: UserCreate): UserCreateApi => ({
  usuario: user.username,
  nombre: user.name,
  correo: user.email,
  tipo: user.role,
  estado: user.isActive ? 'Activo' : 'Inactivo',
  passwoord: user.password,
  pin: user.pin,
});
