import axios from "axios";
import { tokenStorage } from "./tokenStorage";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "https://e-backend-1-zzjf.onrender.com",
  timeout: 15000,
  headers: { Accept: "application/json" },
});

// Attach the JWT to every request automatically
api.interceptors.request.use((config) => {
  const token = tokenStorage.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Unwrap response.data and normalise errors into { status, message, data }
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status ?? null;
    const data = error.response?.data ?? null;

    // Expired/invalid token: clear it and let the app react (redirect to login)
    if (status === 401 && tokenStorage.get()) {
      tokenStorage.clear();
      window.dispatchEvent(new Event("auth:logout"));
    }

    return Promise.reject({
      status,
      data,
      message: data?.message
        ?? data?.error
        ?? (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT"
          ? "The server took too long to respond. Please try again."
          : status
            ? `The request failed with status ${status}.`
            : error.request
              ? "Cannot reach the API server. Please check that it is running."
              : error.message),
    });
  }
);

export default api;
