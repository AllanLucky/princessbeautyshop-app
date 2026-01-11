import axios from "axios";

const BASE_URL = "http://localhost:8000/api/v1";

// Requests that need authentication (cookies / JWT)
export const userRequest = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // include cookies
});
