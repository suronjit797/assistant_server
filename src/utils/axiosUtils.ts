import axios, { AxiosInstance } from "axios";
import config from "../config";

const bukkuAxios: AxiosInstance = axios.create({
  baseURL: config.BUKKU_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "Company-Subdomain": config.BUKKU_SUBDOMAIN,
    Authorization: config.BUKKU_TOKEN,
  },
});

// // Optional: Interceptors for request/response logging or error handling
// bukkuAxios.interceptors.response.use(
//     response => response,
//     error => {
//         // Handle errors globally
//         return Promise.reject(error);
//     }
// );

export default bukkuAxios;
