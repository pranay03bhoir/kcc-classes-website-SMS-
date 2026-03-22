import axios from "axios";

const getBaseURL = () => {
  // Environment variable override
  if (process.env.NEXT_PUBLIC_AXIOS_USER_URL) {
    return process.env.NEXT_PUBLIC_AXIOS_USER_URL;
  }
  
  // Development
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return "http://localhost:5000/api/common";
  }
  
  // Production - try multiple URLs in order
  const productionURLs = [
    "https://kcc-classes-website-sms.onrender.com/api/common",
    "https://api.kccclasses.in/api/common", // Add your domain here if needed
  ];
  
  return productionURLs[0]; // Primary URL
};

const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true, // This ensures that cookies are sent with requests
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000, // 15 second timeout
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      error.message = 'Request timeout. The server is taking too long to respond.';
    } else if (error.code === 'NETWORK_ERROR' || error.code === 'ERR_NETWORK') {
      error.message = 'Network error. Please check your internet connection.';
    } else if (error.response) {
      // Server responded with error status
      error.message = error.response.data?.message || `Server error: ${error.response.status}`;
    } else if (error.request) {
      // Request was made but no response received
      error.message = 'No response from server. The backend might be down.';
    }
    return Promise.reject(error);
  }
);

console.log("API configured with baseURL:", getBaseURL());

export const getAllToppers = async () => {
  return api.get("/get/toppers");
};

export default api;
