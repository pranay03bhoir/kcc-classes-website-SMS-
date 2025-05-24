"use client";

import { Card, CardContent } from "@/components/ui/card";
import Sidebar from "@/Dashboard/AdminDashboard/SideBar";
import api from "@/utils/axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FaBook,
  FaCalendarAlt,
  FaChalkboardTeacher,
  FaPlus,
  FaUserGraduate,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import AdminSummaryCard from "./components/AdminSummaryCard";

export default function AdminDashboard() {
  const [studentCount, setStudentCount] = useState(0);
  const [teacherCount, setTeacherCount] = useState(0);
  const [subjectCount, setSubjectCount] = useState(0);
  const [students, setStudents] = useState([]);
  const [attendanceRate, setAttendanceRate] = useState(94.2);
  const [enrollmentTrend, setEnrollmentTrend] = useState([
    { month: "Jan", count: 1150 },
    { month: "Feb", count: 1180 },
    { month: "Mar", count: 1200 },
    { month: "Apr", count: 1220 },
    { month: "May", count: 1240 },
    { month: "Jun", count: 1247 },
  ]);

  const weeklyAttendance = [
    { day: "Mon", rate: 90 },
    { day: "Tue", rate: 92 },
    { day: "Wed", rate: 88 },
    { day: "Thu", rate: 94 },
    { day: "Fri", rate: 93 },
    { day: "Sat", rate: 91 },
  ];

  useEffect(() => {
    const fetchData = async () => {
      const toastId = toast.loading("Loading data...");
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
          render: "Data loaded successfully",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
      } catch (e) {
        console.error("Dashboard fetch error:", e);
        toast.update(toastId, {
          render: "Error loading data",
          type: "error",
          isLoading: false,
          autoClose: 2000,
        });
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex h-screen">
      <ToastContainer position="top-center" />
      <div className="w-64 fixed h-full">
        <Sidebar />
      </div>

      <div className="flex-1 md:ml-64 bg-[#f9fafb] p-6 overflow-y-auto space-y-6">
        <h2 className="text-2xl font-bold mb-4">Dashboard</h2>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <AdminSummaryCard
            icon={
              <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
                <FaUserGraduate />
              </div>
            }
            label="Total Students"
            value={studentCount}
            growth="12% from last month"
          />
          <AdminSummaryCard
            icon={
              <div className="bg-green-100 text-green-600 p-2 rounded-full">
                <FaChalkboardTeacher />
              </div>
            }
            label="Total Teachers"
            value={teacherCount}
            growth="3% from last month"
          />
          <AdminSummaryCard
            icon={
              <div className="bg-purple-100 text-purple-600 p-2 rounded-full">
                <FaBook />
              </div>
            }
            label="Total Subjects"
            value={subjectCount}
            growth="Active courses"
          />
          <AdminSummaryCard
            icon={
              <div className="bg-orange-100 text-orange-600 p-2 rounded-full">
                <FaCalendarAlt />
              </div>
            }
            label="Attendance Rate"
            value={`${attendanceRate}%`}
            growth="+2.1% from yesterday"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="rounded-2xl shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">
              Student Enrollment Trend
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={enrollmentTrend}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="rounded-2xl shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Weekly Attendance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyAttendance}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="rate" fill="#34d399" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Recent Activities */}
        <div className="grid grid-cols-2 gap-10">
          <Card className="rounded-2xl shadow-md">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
              <ul className="space-y-2">
                <li className="text-sm text-blue-600">
                  📌 New student enrolled - Sarah Johnson joined Mathematics
                  batch (2 mins ago)
                </li>
                <li className="text-sm text-green-600">
                  ✅ Attendance marked - Physics class completed (15 mins ago)
                </li>
                <li className="text-sm text-purple-600">
                  📝 Grades updated - Chemistry exam results published (1 hour
                  ago)
                </li>
                <li className="text-sm text-orange-600">
                  👨‍🏫 New teacher added - Dr. Michael Brown joined Biology
                  department (3 hours ago)
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="rounded-2xl shadow-md">
            <CardContent className="grid grid-cols-2 md:grid-cols-1 gap-4 p-6">
              <Link href={`admindashboard/students`}>
                <button className="bg-blue-600 hover:bg-blue-700 transition text-white rounded-lg px-4 py-2 font-semibold">
                  <FaPlus className="inline mr-2" /> Add New Student
                </button>
              </Link>
              <Link href={`admindashboard/teachers`}>
                <button className="bg-green-600 hover:bg-green-700 transition text-white rounded-lg px-4 py-2 font-semibold">
                  <FaPlus className="inline mr-2" /> Add New Teacher
                </button>
              </Link>
              <Link href={`admindashboard/attendance`}>
                <button className="bg-purple-600 hover:bg-purple-700 transition text-white rounded-lg px-4 py-2 font-semibold">
                  <FaPlus className="inline mr-2" /> Mark Attendance
                </button>
              </Link>
              <Link href={`admindashboard/courses`}>
                <button className="bg-orange-600 hover:bg-orange-700 transition text-white rounded-lg px-4 py-2 font-semibold">
                  <FaPlus className="inline mr-2" /> Create Subject
                </button>
              </Link>
              <Link href={`admindashboard/reports`}>
                <button className="border border-gray-400 hover:border-gray-600 transition text-gray-700 rounded-lg px-4 py-2 font-semibold col-span-2 md:col-span-1">
                  📊 View Reports
                </button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
