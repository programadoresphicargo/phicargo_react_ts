import type { UserUpdate, UserUpdateApi } from '../models';

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

  if (user.isActive) {
    userApi.estado = user.isActive ? 'Activo' : 'Inactivo';
  }

  if (user.password) {
    userApi.passwoord = user.password;
  }

  return userApi;
};

