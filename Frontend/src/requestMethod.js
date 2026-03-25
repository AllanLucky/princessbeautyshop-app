import axios from "axios";

const BASE_URL = "https://backend.kilifoniabeautybliss.co.ke/api/v1";

export const userRequest = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // send cookies (JWT) with requests
});
