import api from "./axiosInstance";

export const sendChatMessage = (message, history) =>
  api.post("/ai/chat", { message, history });
