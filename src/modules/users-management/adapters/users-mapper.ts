import type {
  UserCreate,
  UserCreateApi,
  UserRead,
  UserReadApi,
  UserUpdate,
  UserUpdateApi,
} from '../models';

export class UserAdapter {
  /**
   * Mapper que convierte un objeto con la información del usuario en el formato de la API
   * @param user Objeto con la información del usuario
   * @returns Objeto con la información del usuario en el formato de la API
   */
  static userUpdateToApi(user: UserUpdate): UserUpdateApi {
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

    if (user.id_odoo) {
      userApi.id_odoo = user.id_odoo;
    }

    return userApi;
  }

  /**
   * Mapper that converts an object with the user information to the API format
   * @param user Object with the user information
   * @returns Object with the user information in the API format
   */
  static userToApi(user: UserCreate): UserCreateApi {
    return {
      usuario: user.username,
      nombre: user.name,
      correo: user.email,
      tipo: user.role,
      estado: user.isActive ? 'Activo' : 'Inactivo',
      passwoord: user.password,
      pin: user.pin,
    };
  }

  static userReadToLocal(user: UserReadApi): UserRead {
    return {
      id: user.id_usuario,
      name: user.nombre,
      username: user.usuario,
    };
  }
}

