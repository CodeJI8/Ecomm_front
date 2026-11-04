import api from "./axiosInstance";
import { toFormData } from "./utils";

export const getCategories = (config) => api.get("/categories", config);

// payload: { name, image?: File, parentId?: number }
export const createCategory = (payload) =>
  api.post("/categories", toFormData(payload));

// payload: any of { name, image, parentId, sortOrder, isActive }
export const updateCategory = (id, payload) =>
  api.patch(`/categories/${id}`, toFormData(payload));

export const deleteCategory = (id) => api.delete(`/categories/${id}`);
