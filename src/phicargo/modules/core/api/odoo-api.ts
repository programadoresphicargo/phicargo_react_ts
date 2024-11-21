import axios from 'axios';
import { getEnvVariables } from '../utilities/get-env-variables';

const { VITE_API_URL } = getEnvVariables();

const odooApi = axios.create({
  baseURL: VITE_API_URL,
});

export default odooApi;
