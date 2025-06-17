import axios from "axios";

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_AXIOS_TEACHER_URL ||
    "http://localhost:5000/api/teacher",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
