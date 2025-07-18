import axios from "axios";

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_AXIOS_ADMIN_URL ||
    "http://localhost:5000/api/admin" ||
    "192.168.1.106:5000",
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
            process.env.NEXT_PUBLIC_AXIOS_ADMIN_URL ||
            "http://localhost:5000/api/admin" ||
            "192.168.1.106:5000"
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
          window.location.href = "/login/admin";
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;

export const resendVerificationEmail = async (data) => {
  return api.post("/resend-verification-email", data);
};

export const addTeacherToSubject = async (teacherId, subjects) => {
  // subjects can be a string or array of subject IDs
  let query = "";
  if (Array.isArray(subjects)) {
    query = subjects
      .map((id) => `subjects=${encodeURIComponent(id)}`)
      .join("&");
  } else {
    query = `subjects=${encodeURIComponent(subjects)}`;
  }
  return api.put(`/subjects/add/teachers/${teacherId}?${query}`);
};

export const removeTeacherFromSubject = async (subjectId, teacherIds) => {
  // Ensure teacherIds is always an array
  if (!Array.isArray(teacherIds)) {
    teacherIds = [teacherIds];
  }
  // The backend expects teacherIds as a query array (e.g., ?teacherIds=1&teacherIds=2)
  const query = teacherIds
    .map((id) => `teacherIds=${encodeURIComponent(id)}`)
    .join("&");
  return api.put(`/subjects/teachers/${subjectId}?${query}`);
};

export const addTopperStudent = async (data) => {
  return api.post("/add/topper", data);
};

export const getAllToppers = async () => {
  return api.get("/get/all/toppers");
};

export const deleteTopperStudent = async (id) => {
  return api.delete(`/delete/topper/${id}`);
};
