import api from "./axiosInstance";
import { toFormData } from "./utils";

// params: { page, limit }
export const getProducts = (params = {}, config) =>
  api.get("/products", { params, ...config });

export const getProductById = (id, config) => api.get(`/products/${id}`, config);

// payload: { name, price, description?, compareAtPrice?, stock?, isFeatured?,
//            categoryIds?: number[], images?: File[] }
export const createProduct = (payload) =>
  api.post("/products", toFormData(payload));

// Send only the fields that changed
export const updateProduct = (id, payload) =>
  api.patch(`/products/${id}`, toFormData(payload));

export const deleteProduct = (id) => api.delete(`/products/${id}`);
