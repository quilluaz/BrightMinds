import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "/api",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const path = config.url || "";
  const isAuthEndpoint = typeof path === "string" && /\/auth\//.test(path);
  const isUserRegistration =
    typeof path === "string" && path === "/users" && config.method === "post";

  if (!isAuthEndpoint && !isUserRegistration) {
    const token = sessionStorage.getItem("bm_at");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    const csrf = sessionStorage.getItem("bm_csrf");
    if (csrf && /^(post|put|patch|delete)$/i.test(String(config.method))) {
      config.headers["X-XSRF-TOKEN"] = csrf;
    }
  }

  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    if (status === 401 || status === 419) {
      // attempt refresh once
      return api
        .post("/auth/refresh")
        .then((r) => {
          const at = r?.data?.token;
          let csrf = r?.headers?.["x-xsrf-token"] || r?.data?.csrf;
          if (!csrf) {
            // try to read csrf cookie set by CookieCsrfTokenRepository
            const m = document.cookie.match(/(?:^|; )XSRF-TOKEN=([^;]+)/);
            if (m) csrf = decodeURIComponent(m[1]);
          }
          if (at) sessionStorage.setItem("bm_at", at);
          if (csrf) sessionStorage.setItem("bm_csrf", csrf);
          const original = err.config;
          original.headers = original.headers || {};
          if (at) original.headers.Authorization = `Bearer ${at}`;
          if (
            csrf &&
            /^(post|put|patch|delete)$/i.test(String(original.method))
          ) {
            original.headers["X-XSRF-TOKEN"] = csrf;
          }
          return api.request(original);
        })
        .catch((e) => {
          sessionStorage.removeItem("bm_at");
          sessionStorage.removeItem("bm_user");
          sessionStorage.removeItem("bm_csrf");
          window.location.href = "/";
          return Promise.reject(e);
        });
    }
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
