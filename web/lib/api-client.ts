import axios from "axios";
import { camelizeKeys } from "humps";

// Determine API URL based on environment
const getApiUrl = () => {
  // Use explicit environment variable if set
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // For production deployment on Heroku, use the known API URL
  if (process.env.NODE_ENV === 'production') {
    return 'https://dfip-api-966e801161c5.herokuapp.com';
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

// Helper function to get image thumbnail URL
export const getImageThumbnailUrl = (imageId: string) => {
  return `${getApiUrl()}/api/v1/images/by-image-id/${imageId}/thumbnail`;
};
