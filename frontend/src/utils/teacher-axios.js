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

// Request interceptor to add auth headers if needed
api.interceptors.request.use(
  (config) => {
    // You can add any request preprocessing here
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        const refreshResponse = await axios.post(
          `${
            process.env.NEXT_PUBLIC_AXIOS_TEACHER_URL ||
            "http://localhost:5000/api/teacher"
          }/refresh`,
          {},
          { withCredentials: true }
        );

        if (refreshResponse.data.success) {
          // Retry the original request
          return api(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, redirect to login
        if (typeof window !== "undefined") {
          window.location.href = "/login/teacher";
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;

export const updateTeacherDetails = async (data) => {
  return api.put(`/update/details/${data._id}`, data);
};

export const getTeacherDetails = async () => {
  return api.get("/get/teacher/details");
};

export const resendVerificationEmail = async (data) => {
  return api.post("/resend-verification-email", data);
};
