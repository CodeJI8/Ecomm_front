import api from "./axiosInstance";

export const createOrder = (shippingDetails) =>
  api.post("/orders", shippingDetails);

export const getOrders = (config) =>
  api.get("/orders", config);

export const createCheckoutSession = (orderId) =>
  api.post(`/payments/checkout/${encodeURIComponent(orderId)}`);
