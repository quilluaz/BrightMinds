import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "/api",
  withCredentials: false,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("bm_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.data) {
      const d = err.response.data;
      if (typeof d === "object" && !Array.isArray(d)) {
        const firstKey = Object.keys(d)[0];
        err.message = d[firstKey] || JSON.stringify(d);
      } else if (typeof d === "string") {
        err.message = d;
      }
    }
    return Promise.reject(err);
  }
);

export default api;
