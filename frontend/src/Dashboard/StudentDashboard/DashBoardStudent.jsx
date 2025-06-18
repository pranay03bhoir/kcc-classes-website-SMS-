"use client";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useStudentAuth } from "@/hooks/useStudentAuth";
import api from "@/utils/student-axios";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import AttendanceTable from "./AttendanceTable";
import CourseList from "./CourseList";
import ProfileCard from "./ProfileCard";
import ScoreCard from "./ScoreCard";
import Sidebar from "./SideBar";
import SubjectList from "./SubjectList";

const DashBoardStudent = () => {
  const {
    isAuthenticated,
    isLoading: authLoading,
    user: studentData,
    refreshToken,
  } = useStudentAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated || !studentData) return;

      const toastId = toast.loading("Loading student data...");
      try {
        setLoading(true);
        const response = await api.get("/get/student/details");
        if (response.status === 200) {
          // Data is already available from the auth hook
          toast.update(toastId, {
            render: "Student data loaded successfully!",
            type: "success",
            isLoading: false,
            autoClose: 2000,
          });
        } else {
          toast.update(toastId, {
            render: response?.data?.message || "Failed to load data",
            type: "error",
            isLoading: false,
            autoClose: 2000,
          });
        }
      } catch (err) {
        console.error("Error fetching data:", err);

        // If it's an authentication error, try to refresh token
        if (err.response?.status === 401) {
          const refreshSuccess = await refreshToken();
          if (refreshSuccess) {
            // Retry the request after successful refresh
            fetchData();
            return;
          }
        }

        setError("An error occurred while fetching student data.");
        toast.update(toastId, {
          render: "Failed to load student data",
          type: "error",
          isLoading: false,
          autoClose: 2000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, studentData, refreshToken]);

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading student dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100 ">
      <Sidebar student={studentData} />
      <main className="flex-1 p-6 ms-64">
        <h1 className="text-2xl font-bold mb-4">Student Dashboard</h1>
        <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
          <ProfileCard student={studentData} />
          <ScoreCard student={studentData} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <AttendanceTable student={studentData} />
          <CourseList student={studentData?.subjects} />
        </div>
        <div className="mt-6">
          <SubjectList student={studentData} />
        </div>
      </main>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default DashBoardStudent;
