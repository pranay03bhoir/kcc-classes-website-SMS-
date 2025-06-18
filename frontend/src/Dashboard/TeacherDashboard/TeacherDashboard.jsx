"use client";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useTeacherAuth } from "@/hooks/useTeacherAuth";
import api from "@/utils/teacher-axios";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import StudentTable from "./StudentManagement/StudentTable";

const TeacherDashboard = () => {
  const {
    isAuthenticated,
    isLoading: authLoading,
    user: teacher,
    refreshToken,
  } = useTeacherAuth();
  const [student, setStudent] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * The function `fetchData` asynchronously fetches teacher details and updates a toast notification
   * based on the response status.
   */
  const fetchData = async () => {
    const toastId = toast.loading("Loading students.....");
    try {
      setIsLoading(true);
      console.log("Fetching teacher details...");
      const response = await api.get("get/teacher/details");
      // console.log("Full API Response:", response);
      // console.log("Response data:", response.data);
      // console.log("Teacher data:", response.data.teacher);

      if (!response.data.teacher) {
        console.error("Teacher data is undefined in response");
        toast.update(toastId, {
          render: "Error: Teacher data not found in response",
          type: "error",
          isLoading: false,
          autoClose: 2000,
        });
        return;
      }

      setStudent(response.data.teacher.batches);

      if (response.status === 200) {
        toast.update(toastId, {
          render: response?.data?.message || "Students loaded successfully!",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
      } else {
        toast.update(toastId, {
          render: response?.data?.message || "Something went wrong.",
          type: "error",
          isLoading: false,
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.error("Error details:", {
        message: error.message,
        response: error.response,
        status: error.response?.status,
        data: error.response?.data,
      });

      // If it's an authentication error, try to refresh token
      if (error.response?.status === 401) {
        const refreshSuccess = await refreshToken();
        if (refreshSuccess) {
          // Retry the request after successful refresh
          fetchData();
          return;
        }
      }

      console.error("Error fetching data:", error);
      const message =
        error?.response?.data?.message || "Failed to load students.";
      toast.update(toastId, {
        render: message,
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && teacher) {
      fetchData();
    }
  }, [isAuthenticated, teacher]);

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Show loading while not authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <ToastContainer position="top-center" />
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <StudentTable students={student} teacher={teacher} />
      )}
    </div>
  );
};

export default TeacherDashboard;
