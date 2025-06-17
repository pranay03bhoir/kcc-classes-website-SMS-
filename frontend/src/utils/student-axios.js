import axios from "axios";

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_AXIOS_STUDENT_URL ||
    "http://localhost:5000/api/student",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
