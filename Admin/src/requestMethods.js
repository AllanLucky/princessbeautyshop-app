import axios from "axios";

const BASE_URL = "http://localhost:8000/api/v1";

const admin = JSON.parse(localStorage.getItem("admin"));
const token = admin?.access_token;

export const userRequest = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    Authorization: token ? `Bearer ${token}` : "",
  },
});

