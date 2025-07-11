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
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [enrollmentTrend, setEnrollmentTrend] = useState([
    { month: "Jan", count: 1150, attendance: 92 },
    { month: "Feb", count: 1180, attendance: 93 },
    { month: "Mar", count: 1200, attendance: 91 },
    { month: "Apr", count: 1220, attendance: 94 },
    { month: "May", count: 1240, attendance: 95 },
    { month: "Jun", count: 1247, attendance: 93 },
  ]);

  const [weeklyAttendance, setWeeklyAttendance] = useState([
    { day: "Mon", rate: 90, present: 45, absent: 5 },
    { day: "Tue", rate: 92, present: 46, absent: 4 },
    { day: "Wed", rate: 88, present: 44, absent: 6 },
    { day: "Thu", rate: 94, present: 47, absent: 3 },
    { day: "Fri", rate: 93, present: 46, absent: 4 },
    { day: "Sat", rate: 91, present: 45, absent: 5 },
  ]);

  const fetchData = useCallback(async () => {
    if (!isAuthenticated) return;

    const toastId = toast.loading("Loading dashboard data...");
    setIsLoading(true);
    try {
      const [studentCountRes, teacherCountRes, subjectCountRes, studentsRes, attendanceRes] =
        await Promise.all([
          api.get("/students-count"),
          api.get("/teachers-count"),
          api.get("/subjects-count"),
          api.get("/students"),
          api.get("/all/attendance"),
        ]);

      setStudentCount(studentCountRes?.data?.studentCount || 0);
      setTeacherCount(teacherCountRes?.data?.teacherCount || 0);
      setSubjectCount(subjectCountRes?.data?.subjectCount || 0);
      setStudents(studentsRes?.data?.students || []);
      setAttendanceRecords(attendanceRes?.data?.attendance || []);

      // --- Enrollment Trend Aggregation ---
      const students = studentsRes?.data?.students || [];
      const enrollmentByMonth = {};
      students.forEach((student) => {
        if (!student.createdAt) return;
        const date = new Date(student.createdAt);
        const month = date.toLocaleString("default", { month: "short" });
        const year = date.getFullYear();
        const key = `${month} ${year}`;
        if (!enrollmentByMonth[key]) enrollmentByMonth[key] = { count: 0, attendance: 0 };
        enrollmentByMonth[key].count += 1;
      });
      // Sort by date
      const sortedMonths = Object.keys(enrollmentByMonth)
        .map((key) => {
          const [month, year] = key.split(" ");
          return { key, date: new Date(`${month} 1, ${year}`) };
        })
        .sort((a, b) => a.date - b.date)
        .map((item) => item.key);
      // For each month, calculate average attendance %
      const attendance = attendanceRes?.data?.attendance || [];
      sortedMonths.forEach((key) => {
        // Get students enrolled up to this month
        const [month, year] = key.split(" ");
        const monthIndex = new Date(`${month} 1, ${year}`).getMonth();
        const yearNum = parseInt(year);
        const studentsUpToMonth = students.filter((s) => {
          const d = new Date(s.createdAt);
          return (
            d.getFullYear() < yearNum ||
            (d.getFullYear() === yearNum && d.getMonth() <= monthIndex)
          );
        });
        // Attendance records for these students in this month
        const monthAttendance = attendance.filter((a) => {
          const d = new Date(a.date);
          return (
            d.getFullYear() === yearNum && d.getMonth() === monthIndex &&
            studentsUpToMonth.some((s) => s._id === (a.student?._id || a.student))
          );
        });
        const presentCount = monthAttendance.filter((a) => a.status === "Present").length;
        const totalCount = monthAttendance.length;
        enrollmentByMonth[key].attendance = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;
      });
      setEnrollmentTrend(
        sortedMonths.map((key) => ({
          month: key,
          count: enrollmentByMonth[key].count,
          attendance: enrollmentByMonth[key].attendance,
        }))
      );

      // --- Weekly Attendance Aggregation ---
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const weekly = days.map((day) => ({ day, present: 0, absent: 0 }));
      attendance.forEach((a) => {
        const d = new Date(a.date);
        const dayIdx = d.getDay();
        if (a.status === "Present") weekly[dayIdx].present += 1;
        if (a.status === "Absent") weekly[dayIdx].absent += 1;
      });
      // Only show Mon-Sat for chart (skip Sunday if not used)
      setWeeklyAttendance(weekly.slice(1, 7));

      // --- Attendance Rate ---
      const totalAttendance = attendance.length;
      const presentAttendance = attendance.filter((a) => a.status === "Present").length;
      setAttendanceRate(totalAttendance > 0 ? ((presentAttendance / totalAttendance) * 100).toFixed(1) : 0);

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

  // Helper to get date range for filter
  const getDateRange = (period) => {
    const now = new Date();
    let start, end;
    end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    if (period === "week") {
      // Start from last Monday
      const day = now.getDay();
      const diff = now.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is Sunday
      start = new Date(now.setDate(diff));
      start.setHours(0, 0, 0, 0);
    } else if (period === "month") {
      start = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (period === "year") {
      start = new Date(now.getFullYear(), 0, 1);
    } else {
      start = new Date(0);
    }
    return { start, end };
  };

  // Filtering logic
  const getFilteredData = () => {
    const { start, end } = getDateRange(filterPeriod);
    // Filter students by createdAt
    const filteredStudents = students.filter((s) => {
      const d = new Date(s.createdAt);
      return d >= start && d <= end;
    });
    // Filter attendance by date
    const filteredAttendance = attendanceRecords.filter((a) => {
      const d = new Date(a.date);
      return d >= start && d <= end;
    });
    return { filteredStudents, filteredAttendance };
  };

  // Recompute dashboard data when filterPeriod, students, or attendanceRecords change
  useEffect(() => {
    if (!students.length && !attendanceRecords.length) return;
    const { filteredStudents, filteredAttendance } = getFilteredData();

    // --- Enrollment Trend Aggregation ---
    const enrollmentByMonth = {};
    filteredStudents.forEach((student) => {
      if (!student.createdAt) return;
      const date = new Date(student.createdAt);
      const month = date.toLocaleString("default", { month: "short" });
      const year = date.getFullYear();
      const key = `${month} ${year}`;
      if (!enrollmentByMonth[key]) enrollmentByMonth[key] = { count: 0, attendance: 0 };
      enrollmentByMonth[key].count += 1;
    });
    // Sort by date
    const sortedMonths = Object.keys(enrollmentByMonth)
      .map((key) => {
        const [month, year] = key.split(" ");
        return { key, date: new Date(`${month} 1, ${year}`) };
      })
      .sort((a, b) => a.date - b.date)
      .map((item) => item.key);
    // For each month, calculate average attendance %
    sortedMonths.forEach((key) => {
      // Get students enrolled up to this month
      const [month, year] = key.split(" ");
      const monthIndex = new Date(`${month} 1, ${year}`).getMonth();
      const yearNum = parseInt(year);
      const studentsUpToMonth = filteredStudents.filter((s) => {
        const d = new Date(s.createdAt);
        return (
          d.getFullYear() < yearNum ||
          (d.getFullYear() === yearNum && d.getMonth() <= monthIndex)
        );
      });
      // Attendance records for these students in this month
      const monthAttendance = filteredAttendance.filter((a) => {
        const d = new Date(a.date);
        return (
          d.getFullYear() === yearNum && d.getMonth() === monthIndex &&
          studentsUpToMonth.some((s) => s._id === (a.student?._id || a.student))
        );
      });
      const presentCount = monthAttendance.filter((a) => a.status === "Present").length;
      const totalCount = monthAttendance.length;
      enrollmentByMonth[key].attendance = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;
    });
    setEnrollmentTrend(
      sortedMonths.map((key) => ({
        month: key,
        count: enrollmentByMonth[key].count,
        attendance: enrollmentByMonth[key].attendance,
      }))
    );

    // --- Weekly Attendance Aggregation ---
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const weekly = days.map((day) => ({ day, present: 0, absent: 0 }));
    filteredAttendance.forEach((a) => {
      const d = new Date(a.date);
      const dayIdx = d.getDay();
      if (a.status === "Present") weekly[dayIdx].present += 1;
      if (a.status === "Absent") weekly[dayIdx].absent += 1;
    });
    setWeeklyAttendance(weekly.slice(1, 7));

    // --- Attendance Rate ---
    const totalAttendance = filteredAttendance.length;
    const presentAttendance = filteredAttendance.filter((a) => a.status === "Present").length;
    setAttendanceRate(totalAttendance > 0 ? ((presentAttendance / totalAttendance) * 100).toFixed(1) : 0);

    // --- Summary Cards ---
    setStudentCount(filteredStudents.length);
    // For teachers and subjects, you may want to filter by those active in the period, but for now, keep as is
    // setTeacherCount(...)
    // setSubjectCount(...)
  }, [filterPeriod, students, attendanceRecords]);

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
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 pt-16">
      <ToastContainer position="top-center" />
      <TokenRefreshIndicator />

      {/* Sidebar - Fixed on desktop, overlay on mobile */}
      <div className="fixed inset-y-0 left-0 z-40 md:relative md:z-auto">
        <Sidebar />
      </div>

      {/* Main content area - Properly positioned for mobile and desktop */}
      <div className="flex-1 w-full md:ml-16 p-4 md:p-8 overflow-y-auto flex flex-col items-center space-y-8">
        {/* Glassmorphic Header & Filter Bar */}
        <div className="sticky top-0 z-30 mb-8 w-full max-w-7xl flex flex-col md:flex-row justify-between items-center gap-4 px-6 py-4 rounded-2xl bg-white/60 backdrop-blur-md shadow-lg border border-blue-100">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl md:text-3xl font-extrabold text-gray-800 tracking-tight drop-shadow-sm"
          >
            Admin Dashboard
          </motion.h2>

          <div className="flex gap-3 items-center">
            <Select value={filterPeriod} onValueChange={handleFilterChange}>
              <SelectTrigger className="w-32 bg-white/80 border border-blue-200 shadow-sm rounded-lg focus:ring-2 focus:ring-blue-300">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent className="rounded-lg shadow-xl">
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>

            <Button
              onClick={handleRefresh}
              variant="outline"
              className="whitespace-nowrap bg-gradient-to-r from-blue-100 to-teal-100 border border-blue-200 shadow-md rounded-lg hover:from-blue-200 hover:to-teal-200 transition-all"
            >
              <FaSync className={`mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        <div className="w-full max-w-7xl flex flex-col items-center">
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
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full"
              >
                <AdminSummaryCard
                  title="Total Students"
                  value={studentCount}
                  icon={<FaUserGraduate className="h-7 w-7 text-white bg-gradient-to-br from-blue-400 to-teal-400 rounded-full p-2 shadow-md" />}
                  trend="+12%"
                  trendUp={true}
                  className="bg-gradient-to-br from-blue-100 to-white border border-blue-200 shadow-lg rounded-2xl hover:scale-105 transition-transform duration-200"
                />
                <AdminSummaryCard
                  title="Total Teachers"
                  value={teacherCount}
                  icon={<FaChalkboardTeacher className="h-7 w-7 text-white bg-gradient-to-br from-indigo-400 to-blue-400 rounded-full p-2 shadow-md" />}
                  trend="+5%"
                  trendUp={true}
                  className="bg-gradient-to-br from-indigo-100 to-white border border-indigo-200 shadow-lg rounded-2xl hover:scale-105 transition-transform duration-200"
                />
                <AdminSummaryCard
                  title="Total Courses"
                  value={subjectCount}
                  icon={<FaBook className="h-7 w-7 text-white bg-gradient-to-br from-teal-400 to-blue-400 rounded-full p-2 shadow-md" />}
                  trend="+8%"
                  trendUp={true}
                  className="bg-gradient-to-br from-teal-100 to-white border border-teal-200 shadow-lg rounded-2xl hover:scale-105 transition-transform duration-200"
                />
                <AdminSummaryCard
                  title="Attendance Rate"
                  value={`${attendanceRate}%`}
                  icon={<FaCalendarAlt className="h-7 w-7 text-white bg-gradient-to-br from-pink-400 to-blue-400 rounded-full p-2 shadow-md" />}
                  trend="+2.5%"
                  trendUp={true}
                  className="bg-gradient-to-br from-pink-100 to-white border border-pink-200 shadow-lg rounded-2xl hover:scale-105 transition-transform duration-200"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-10 mt-10 items-start">
          <Card className="p-6 rounded-2xl shadow-xl border-0 bg-gradient-to-br from-blue-50 to-white hover:shadow-2xl transition-all">
            <h3 className="text-xl font-bold mb-4 text-blue-800 tracking-tight text-center lg:text-left">Enrollment Trend</h3>
            <div className="h-[320px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={enrollmentTrend}>
                  <defs>
                    <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#38bdf8" stopOpacity={0.2} />
                    </linearGradient>
                    <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#f472b6" stopOpacity={0.2} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ef" />
                  <XAxis dataKey="month" tick={{ fontWeight: 600, fill: '#64748b' }} />
                  <YAxis yAxisId="left" tick={{ fontWeight: 600, fill: '#64748b' }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontWeight: 600, fill: '#64748b' }} />
                  <Tooltip contentStyle={{ borderRadius: 12, background: '#fff', boxShadow: '0 2px 8px #e0e7ef' }} />
                  <Legend iconType="circle" />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="count"
                    stroke="url(#colorStudents)"
                    strokeWidth={3}
                    dot={{ r: 5, fill: '#6366f1', stroke: '#fff', strokeWidth: 2 }}
                    activeDot={{ r: 8 }}
                    name="Students"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="attendance"
                    stroke="url(#colorAttendance)"
                    strokeWidth={3}
                    dot={{ r: 5, fill: '#14b8a6', stroke: '#fff', strokeWidth: 2 }}
                    activeDot={{ r: 8 }}
                    name="Attendance %"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6 rounded-2xl shadow-xl border-0 bg-gradient-to-br from-teal-50 to-white hover:shadow-2xl transition-all">
            <h3 className="text-xl font-bold mb-4 text-teal-800 tracking-tight text-center lg:text-left">Weekly Attendance</h3>
            <div className="h-[320px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyAttendance}>
                  <defs>
                    <linearGradient id="barPresent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22c55e" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#a7f3d0" stopOpacity={0.2} />
                    </linearGradient>
                    <linearGradient id="barAbsent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#fca5a5" stopOpacity={0.2} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ef" />
                  <XAxis dataKey="day" tick={{ fontWeight: 600, fill: '#64748b' }} />
                  <YAxis tick={{ fontWeight: 600, fill: '#64748b' }} />
                  <Tooltip contentStyle={{ borderRadius: 12, background: '#fff', boxShadow: '0 2px 8px #e0e7ef' }} />
                  <Legend iconType="circle" />
                  <Bar dataKey="present" fill="url(#barPresent)" name="Present" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="absent" fill="url(#barAbsent)" name="Absent" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
