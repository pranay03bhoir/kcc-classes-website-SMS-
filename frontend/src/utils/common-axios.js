import axios from "axios";

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_AXIOS_USER_URL ||
    (typeof window !== 'undefined' && window.location.hostname === 'localhost' 
      ? "http://localhost:5000/api/common"
      : "https://kcc-classes-website-sms.onrender.com/api/common"),
  withCredentials: true, // This ensures that cookies are sent with requests
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 second timeout
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      error.message = 'Request timeout. Please check your connection and try again.';
    } else if (error.code === 'NETWORK_ERROR') {
      error.message = 'Network error. Please check your internet connection.';
    } else if (error.response) {
      // Server responded with error status
      error.message = error.response.data?.message || `Server error: ${error.response.status}`;
    } else if (error.request) {
      // Request was made but no response received
      error.message = 'No response from server. Please try again.';
    }
    return Promise.reject(error);
  }
);

export const getAllToppers = async () => {
  return api.get("/get/toppers");
};

export default api;
