"use client";
import { Skeleton } from "@/components/ui/skeleton";
import AdminSummaryCard from "@/Dashboard/AdminDashboard/components/AdminSummaryCard";
import StudentsAndBatchesManagement from "@/Dashboard/AdminDashboard/components/StudentsAndBatchesManagement";
import Sidebar from "@/Dashboard/AdminDashboard/SideBar";
import api from "@/utils/axios";
import { useCallback, useEffect, useState } from "react";
import {
  FaBook,
  FaChalkboardTeacher,
  FaUserGraduate,
  FaUsers,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";

const AdminStudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [studentCount, setStudentCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    const toastId = toast.loading("Fetching data...");
    setIsLoading(true);
    setError(null);

    try {
      const [
        studentsData,
        coursesData,
        batchesData,
        studentCountData,
        teachersData,
      ] = await Promise.all([
        api.get("/students"),
        api.get("/subjects"),
        api.get("/batches"),
        api.get("/students-count"),
        api.get("/teachers"),
      ]);

      setStudents(studentsData.data.students);
      setCourses(coursesData.data.subjects);
      setBatches(batchesData.data.batches);
      setStudentCount(studentCountData.data.studentCount);
      setTeachers(teachersData.data.teachers);

      toast.update(toastId, {
        render: "Data loaded successfully",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Error fetching data";
      console.error("Error fetching data:", err);
      setError(errorMessage);
      toast.update(toastId, {
        render: errorMessage,
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const renderSummaryCards = () => {
    if (isLoading) {
      return Array(4)
        .fill(0)
        .map((_, index) => (
          <div key={index} className="p-4 border rounded-lg">
            <Skeleton className="h-24 w-full" />
          </div>
        ));
    }

    return (
      <>
        <AdminSummaryCard
          icon={<FaUserGraduate className="text-blue-600" />}
          label="Total Students"
          value={studentCount}
          trend={"+12%"}
        />
        <AdminSummaryCard
          icon={<FaChalkboardTeacher className="text-green-600" />}
          label="Total Teachers"
          value={teachers.length}
          trend={"+5%"}
        />
        <AdminSummaryCard
          icon={<FaBook className="text-purple-600" />}
          label="Total Courses"
          value={courses.length}
          trend={"+8%"}
        />
        <AdminSummaryCard
          icon={<FaUsers className="text-orange-600" />}
          label="Total Batches"
          value={batches.length}
          trend={"+15%"}
        />
      </>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-50 pt-16">
      <ToastContainer position="top-center" />

      {/* Sidebar - Fixed on desktop, overlay on mobile */}
      <div className="fixed inset-y-0 left-0 z-40 md:relative md:z-auto">
        <Sidebar />
      </div>

      {/* Main content area - Properly positioned for mobile and desktop */}
      <div className="flex-1 w-full md:ml-16 bg-[#f9fafb] p-4 md:p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">
              Student Management Dashboard
            </h1>
            <button
              onClick={fetchData}
              className="w-full md:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Refreshing...
                </span>
              ) : (
                "Refresh Data"
              )}
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <div className="flex items-center gap-2">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {error}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {renderSummaryCards()}
          </div>

          <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-64 w-full" />
              </div>
            ) : (
              <StudentsAndBatchesManagement
                students={students}
                courses={courses}
                batches={batches}
                teachers={teachers}
                onDataUpdate={fetchData}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStudentManagement;
