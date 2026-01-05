
import axios from "axios";

const BASE_URL = "http://localhost:8000/api/v1"; // adjust API base URL

// Public requests (no auth)
export const publicRequest = axios.create({
  baseURL: BASE_URL,
});

// Admin requests (with JWT token)
export const adminRequest = axios.create({
  baseURL: BASE_URL,
  headers: {
    token: `Bearer ${localStorage.getItem("access_token")}`,
  },
});
