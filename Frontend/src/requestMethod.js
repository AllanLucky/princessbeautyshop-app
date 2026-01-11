import axios from "axios";

const BASE_URL = "http://localhost:8000/api/v1";

const user = JSON.parse(localStorage.getItem("user"));
const TOKEN = user?.accessToken;

export const userRequest = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${TOKEN}`,
  },
  withCredentials: true,
});

export const publicRequest = axios.create({
  baseURL: BASE_URL,
});

