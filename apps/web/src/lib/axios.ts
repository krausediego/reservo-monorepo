import axios from "axios";

export const clientAPI = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL_API,
  withCredentials: true,
});
