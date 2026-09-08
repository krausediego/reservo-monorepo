import axios from "axios";

export const clientAPI = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL_API,
  withCredentials: true,
});

const excludedRoutes = ["/admin/me"];

clientAPI.interceptors.response.use(
  async (response) => {
    const url = response.config.url;

    const isExcluded = excludedRoutes.some((route) => url?.includes(route));

    if (isExcluded) {
      return response;
    }

    await new Promise((resolve) => setTimeout(resolve, 3000));
    return response;
  },
  async (error) => {
    const apiMessage = error.response?.data?.message;
    if (apiMessage) {
      error.message = apiMessage;
    }
    await new Promise((resolve) => setTimeout(resolve, 3000));
    return Promise.reject(error);
  },
);
