import axios from "axios";

const BASE_URL = "http://localhost:8000/api/v1";

export const adminRequest = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // optional, if you use cookies
});
