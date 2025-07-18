import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_AXIOS_USER_URL, // Replace with your backend URL
  withCredentials: true, // This ensures that cookies are sent with requests
  headers: {
    "Content-Type": "application/json",
  },
});

export const getAllToppers = async () => {
  return api.get("/get/toppers");
};

export default api;
