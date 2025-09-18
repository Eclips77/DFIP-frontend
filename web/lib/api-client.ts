import axios from "axios";
import { camelizeKeys } from "humps";

// Determine API URL based on environment
const getApiUrl = () => {
  // Use explicit environment variable if set
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // Check if we're in production by hostname
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname === 'dfip-frontend-2e61b982be78.herokuapp.com') {
      return 'https://dfip-api-966e801161c5.herokuapp.com';
    }
  }
  
  // Default to localhost for development
  return "http://localhost:8000";
};

const api = axios.create({
  baseURL: getApiUrl(),
  headers: {
    "Content-Type": "application/json",
  },
});

// Axios interceptor to convert all response data to camelCase
// This is useful because the Python backend sends snake_case keys.
api.interceptors.response.use((response) => {
  if (
    response.data &&
    response.headers["content-type"] === "application/json"
  ) {
    response.data = camelizeKeys(response.data);
  }
  return response;
});

export default api;
