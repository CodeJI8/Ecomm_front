import api from "./axiosInstance";

// items: [{ productId, quantity }]
export const updateCart = (items) => api.patch("/carts", { items });
