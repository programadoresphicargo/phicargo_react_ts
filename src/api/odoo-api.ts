import type { Session } from '@/modules/auth/models';
import axios from 'axios';
import { getEnvVariables } from '@/utilities';

const { VITE_ODOO_API_URL } = getEnvVariables();

const odooApi = axios.create({
  baseURL: VITE_ODOO_API_URL,
});

odooApi.interceptors.request.use(
  (request) => {
    const storeSession = sessionStorage.getItem('session');
    if (storeSession) {
      const session: Session = JSON.parse(storeSession);
      request.headers['Authorization'] = `Bearer ${session.token.accessToken}`;
    }
    return request;
  },
  (error) => {
    return Promise.reject(error);
  },
);

odooApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const VALID_ROUTES = '/auth/login';
    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      window.location.pathname !== VALID_ROUTES
    ) {
      originalRequest._retry = true;
      sessionStorage.removeItem('session');
      window.location.href = '/';
      return Promise.reject(error);
    }
    return Promise.reject(error);
  },
);

export default odooApi;
