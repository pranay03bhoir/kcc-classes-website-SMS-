"use client";

import TokenRefreshIndicator from "@/components/TokenRefreshIndicator";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Sidebar from "@/Dashboard/AdminDashboard/SideBar";
import { useAuth } from "@/hooks/useAuth";
import api from "@/utils/axios";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import {
  FaBook,
  FaCalendarAlt,
  FaChalkboardTeacher,
  FaSearch,
  FaSync,
  FaUserGraduate,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import AdminSummaryCard from "./components/AdminSummaryCard";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export default function AdminDashboard() {
  const {
    isAuthenticated,
    isLoading: authLoading,
    user,
    refreshToken,
  } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [studentCount, setStudentCount] = useState(0);
  const [teacherCount, setTeacherCount] = useState(0);
  const [subjectCount, setSubjectCount] = useState(0);
  const [students, setStudents] = useState([]);
  const [attendanceRate, setAttendanceRate] = useState(94.2);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPeriod, setFilterPeriod] = useState("month");
  const [enrollmentTrend, setEnrollmentTrend] = useState([
    { month: "Jan", count: 1150, attendance: 92 },
    { month: "Feb", count: 1180, attendance: 93 },
    { month: "Mar", count: 1200, attendance: 91 },
    { month: "Apr", count: 1220, attendance: 94 },
    { month: "May", count: 1240, attendance: 95 },
    { month: "Jun", count: 1247, attendance: 93 },
  ]);

  const weeklyAttendance = [
    { day: "Mon", rate: 90, present: 45, absent: 5 },
    { day: "Tue", rate: 92, present: 46, absent: 4 },
    { day: "Wed", rate: 88, present: 44, absent: 6 },
    { day: "Thu", rate: 94, present: 47, absent: 3 },
    { day: "Fri", rate: 93, present: 46, absent: 4 },
    { day: "Sat", rate: 91, present: 45, absent: 5 },
  ];

  const fetchData = useCallback(async () => {
    if (!isAuthenticated) return;

    const toastId = toast.loading("Loading dashboard data...");
    setIsLoading(true);
    try {
      const [studentCountRes, teacherCountRes, subjectCountRes, studentsRes] =
        await Promise.all([
          api.get("/students-count"),
          api.get("/teachers-count"),
          api.get("/subjects-count"),
          api.get("/students"),
        ]);

      setStudentCount(studentCountRes?.data?.studentCount || 0);
      setTeacherCount(teacherCountRes?.data?.teacherCount || 0);
      setSubjectCount(subjectCountRes?.data?.subjectCount || 0);
      setStudents(studentsRes?.data?.students || []);

      toast.update(toastId, {
        render: "Dashboard data updated successfully",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
    } catch (e) {
      console.error("Dashboard fetch error:", e);

      // If it's an authentication error, try to refresh token
      if (e.response?.status === 401) {
        const refreshSuccess = await refreshToken();
        if (refreshSuccess) {
          // Retry the request after successful refresh
          fetchData();
          return;
        }
      }

      toast.update(toastId, {
        render: "Error loading dashboard data. Please try again.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, refreshToken]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
      // Set up polling for real-time updates every 5 minutes
      const intervalId = setInterval(fetchData, 300000);
      return () => clearInterval(intervalId);
    }
  }, [fetchData, refreshKey, isAuthenticated]);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
    toast.info("Refreshing dashboard data...");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality
    toast.info("Search functionality coming soon!");
  };

  const handleFilterChange = (value) => {
    setFilterPeriod(value);
    // Implement filter functionality based on period
    toast.info(`Filtering data for ${value}...`);
  };

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full border-4 border-gray-200 border-t-blue-600 w-12 h-12 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Show loading while not authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full border-4 border-gray-200 border-t-blue-600 w-12 h-12 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 pt-16">
      <ToastContainer position="top-center" />
      <TokenRefreshIndicator />

      {/* Sidebar - Fixed on desktop, overlay on mobile */}
      <div className="fixed inset-y-0 left-0 z-40 md:relative md:z-auto">
        <Sidebar />
      </div>

      {/* Main content area - Properly positioned for mobile and desktop */}
      <div className="flex-1 w-full md:ml-16 bg-[#f9fafb] p-4 md:p-6 overflow-y-auto space-y-4 md:space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xl md:text-2xl font-bold"
          >
            Dashboard
          </motion.h2>

          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center w-full md:w-auto">
            <form
              onSubmit={handleSearch}
              className="flex gap-2 w-full sm:w-auto"
            >
              <Input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-48"
              />
              <Button
                type="submit"
                variant="outline"
                className="whitespace-nowrap"
              >
                <FaSearch className="mr-2" /> Search
              </Button>
            </form>

            <div className="flex gap-2">
              <Select value={filterPeriod} onValueChange={handleFilterChange}>
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>

              <Button
                onClick={handleRefresh}
                variant="outline"
                className="whitespace-nowrap"
              >
                <FaSync className={`mr-2 ${isLoading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center items-center h-64"
            >
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              <AdminSummaryCard
                title="Total Students"
                value={studentCount}
                icon={<FaUserGraduate className="h-6 w-6" />}
                trend="+12%"
                trendUp={true}
              />
              <AdminSummaryCard
                title="Total Teachers"
                value={teacherCount}
                icon={<FaChalkboardTeacher className="h-6 w-6" />}
                trend="+5%"
                trendUp={true}
              />
              <AdminSummaryCard
                title="Total Courses"
                value={subjectCount}
                icon={<FaBook className="h-6 w-6" />}
                trend="+8%"
                trendUp={true}
              />
              <AdminSummaryCard
                title="Attendance Rate"
                value={`${attendanceRate}%`}
                icon={<FaCalendarAlt className="h-6 w-6" />}
                trend="+2.5%"
                trendUp={true}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Enrollment Trend</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={enrollmentTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="count"
                    stroke="#8884d8"
                    name="Students"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="attendance"
                    stroke="#82ca9d"
                    name="Attendance %"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Weekly Attendance</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyAttendance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="present" fill="#4CAF50" name="Present" />
                  <Bar dataKey="absent" fill="#F44336" name="Absent" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
