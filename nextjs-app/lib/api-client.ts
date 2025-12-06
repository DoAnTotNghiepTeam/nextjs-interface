
import axios from "axios";
import { getSession } from "next-auth/react";

export const apiClient = axios.create({
  baseURL: "http://localhost:8080", // đổi cho phù hợp
   headers: {
    "Content-Type": "application/json",
  },
});


// Thêm interceptor để gắn token trước khi gửi request
apiClient.interceptors.request.use(async (config) => {
  const session = await getSession();
  const token = session?.accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

