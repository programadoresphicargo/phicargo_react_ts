/**
 * Obtener las variables de entorno
 * @returns {Object} - Returns an object with all the environment variables
 */
export const getEnvVariables = () => {
  const envs = import.meta.env;

  return {
    ...envs,
  }
}