import axios from "axios";
import { camelizeKeys } from "humps";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
console.log('API Client Configuration:', {
  baseURL,
  env: process.env.NODE_ENV,
  apiUrl: process.env.NEXT_PUBLIC_API_URL
});

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 second timeout
});

// Add request interceptor for debugging
api.interceptors.request.use((config) => {
  console.log('Making API request:', {
    url: config.url,
    baseURL: config.baseURL,
    fullURL: `${config.baseURL}${config.url}`
  });
  return config;
}, (error) => {
  console.error('Request error:', error);
  return Promise.reject(error);
});

// Axios interceptor to convert all response data to camelCase
// This is useful because the Python backend sends snake_case keys.
api.interceptors.response.use((response) => {
  console.log('API response received:', {
    url: response.config.url,
    status: response.status,
    data: response.data
  });
  
  if (
    response.data &&
    response.headers["content-type"] === "application/json"
  ) {
    response.data = camelizeKeys(response.data);
  }
  return response;
}, (error) => {
  console.error('API response error:', {
    url: error.config?.url,
    status: error.response?.status,
    message: error.message,
    response: error.response?.data
  });
  return Promise.reject(error);
});

export default api;
