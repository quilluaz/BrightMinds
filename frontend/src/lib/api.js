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
    const token = localStorage.getItem("bm_at");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    const csrf = localStorage.getItem("bm_csrf");
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
    if (status === 429) {
       // Ideally we would use a Toast here, but since this is a pure JS file, we might not have access to UI context.
       // However, we can modify the error message so the UI component consuming it can display it.
       const retryAfter = err.response.headers['retry-after'];
       const msg = `Server is busy. Please try again in ${retryAfter || 1} seconds.`;
       // If the app has a global alert system attached to window (common in legacy or simple apps), trigger it.
       if (window.alert) console.warn("Rate limit hit:", msg); // Don't use window.alert as it blocks execution.
       
       err.message = msg;
       // Fall through to reject so the UI handles it
    }

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
          if (at) localStorage.setItem("bm_at", at);
          if (csrf) localStorage.setItem("bm_csrf", csrf);
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
          localStorage.removeItem("bm_at");
          localStorage.removeItem("bm_user");
          localStorage.removeItem("bm_csrf");
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
