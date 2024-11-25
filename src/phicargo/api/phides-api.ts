import axios from "axios";

const { VITE_PHIDES_API_URL } = import.meta.env;

const phidesApi = axios.create({
  baseURL: VITE_PHIDES_API_URL,
  withCredentials: false
});

export default phidesApi;