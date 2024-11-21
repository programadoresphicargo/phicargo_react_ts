import axios from 'axios';
import { getEnvVariables } from '../utilities/get-env-variables';

const { VITE_ODOO_API_URL } = getEnvVariables();

const odooApi = axios.create({
  baseURL: VITE_ODOO_API_URL,
});

export default odooApi;
