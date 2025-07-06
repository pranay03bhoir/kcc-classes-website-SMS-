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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600 font-medium">
            Checking authentication...
          </p>
        </div>
      </div>
    );
  }

  // Show loading while not authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600 font-medium">
            Redirecting to login...
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600 font-medium">
            Loading student dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-16">
      {/* Sidebar - Fixed on desktop, overlay on mobile */}
      <div className="fixed inset-y-0 left-0 z-40 md:relative md:z-auto">
        <Sidebar student={studentData} />
      </div>

      {/* Main content area - Properly positioned for mobile and desktop */}
      <main className="flex-1 w-full md:ml-16 p-6">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Welcome back, {studentData?.name?.split(" ")[0] || "Student"}!
              </h1>
              <p className="text-gray-600 mt-1">
                Here's what's happening with your studies today
              </p>
            </div>
            <div className="hidden md:block">
              <div className="text-right">
                <p className="text-sm text-gray-500">Current Date</p>
                <p className="text-lg font-semibold text-gray-700">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <ProfileCard student={studentData || {}} />
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <ScoreCard student={studentData || {}} />
          </div>
        </div>

        {/* Content Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
            <AttendanceTable student={studentData || {}} />
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
            <CourseList student={studentData || {}} />
          </div>
        </div>

        {/* Full Width Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
          <SubjectList student={studentData || {}} />
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
