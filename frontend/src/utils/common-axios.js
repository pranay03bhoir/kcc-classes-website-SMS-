import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api/common", // Replace with your backend URL
  withCredentials: true, // This ensures that cookies are sent with requests
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
