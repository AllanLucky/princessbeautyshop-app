import axios from "axios";

const BASE_URL = "http://localhost:8000/api/v1";

export const userRequest = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // ✅ must have this for cookies
});

