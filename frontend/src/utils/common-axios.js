import axios from "axios";

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_AXIOS_USER_URL ||
    "http://localhost:5000/api/common", // Replace with your backend URL
  withCredentials: true, // This ensures that cookies are sent with requests
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
