import api from "./axiosInstance";
import { tokenStorage } from "./tokenStorage";

export const register = ({ name, email, password }) =>
  api.post("/register", { name, email, password });

export const login = async ({ email, password }) => {
  const data = await api.post("/login", { email, password });
  if (data?.token) tokenStorage.set(data.token);
  return data;
};

export const logout = () => tokenStorage.clear();

export const getProfile = (config) => api.get("/profile", config);

export const forgotPassword = (email) => api.post("/forgot-password", { email });

export const resetPassword = ({ token, newPassword }) =>
  api.post("/reset-password", { token, newPassword });
