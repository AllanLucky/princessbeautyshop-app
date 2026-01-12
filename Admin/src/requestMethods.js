import axios from "axios";

const BASE_URL = "http://localhost:8000/api/v1";

export const userRequest = axios.create({
  baseURL: BASE_URL,
});

// Attach token dynamically before each request
userRequest.interceptors.request.use(
  (config) => {
    const admin = JSON.parse(localStorage.getItem("admin"));
    const token = admin?.access_token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


