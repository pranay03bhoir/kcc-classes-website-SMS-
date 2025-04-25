"use client";

import { Card, CardContent } from "@/components/ui/card";
import Sidebar from "@/Dashboard/AdminDashboard/SideBar";
import api from "@/utils/axios";
import { useEffect, useState } from "react";
import {
  FaBook,
  FaCalendarAlt,
  FaChalkboardTeacher,
  FaUserGraduate,
  FaUsers,
} from "react-icons/fa";
import AdminSummaryCard from "./components/AdminSummaryCard";
import { toast, ToastContainer } from "react-toastify";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Progress } from "@/components/ui/progress";
export default function AdminDashboard() {
  // const [summary, setSummary] = useState(null);
  const [studentCount, setStudentCount] = useState([]);
  const [teacherCount, setTeacherCount] = useState([]);
  const [subjectCount, setSubjectCount] = useState([]);
  const [students, setStudents] = useState([]);

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

  // --- Auth Guard (optional) --- //
  // useEffect(() => {
  //   const token = localStorage.getItem("adminToken");
  //   if (!token) router.push("/admin/login");
  // }, [router]);

  // useEffect(() => {
  //   fetchData().then((data) => setSummary(data));
  // }, []);

  // if (!summary) return <p className="p-6">Loading dashboard...</p>;

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <ToastContainer position="top-center" />
      <div className="w-64 fixed h-full">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 md:ml-64 lg-2 bg-gray-100 p-6 space-y-6">
        <h2 className="text-2xl font-bold">Admin Dashboard</h2>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 text-center">
          <div>
            <AdminSummaryCard
              icon={<FaUserGraduate />}
              label="Total Students"
              value={studentCount}
            />
            <div className={`px-10 pt-2`}>
              <Progress value={studentCount} className="bg-red-200">
                <div className="bg-blue-600 h-full" style={{ width: "70%" }} />
              </Progress>
            </div>
          </div>
          <div>
            <AdminSummaryCard
              icon={<FaChalkboardTeacher />}
              label="Total Teachers"
              value={teacherCount}
            />
            <div className={`px-10 pt-2`}>
              <Progress value={teacherCount} className="bg-red-200">
                <div className="bg-blue-600 h-full" style={{ width: "70%" }} />
              </Progress>
            </div>
          </div>
          <div>
            <AdminSummaryCard
              icon={<FaBook />}
              label="Total Subjects"
              value={subjectCount}
            />
            <div className={`px-10 pt-2`}>
              <Progress value={subjectCount} className="bg-red-200">
                <div className="bg-blue-600 h-full" style={{ width: "70%" }} />
              </Progress>
            </div>
          </div>
          <div>
            <AdminSummaryCard
              icon={<FaUsers />}
              label="Total Batches"
              value={`${studentCount + teacherCount}`}
            />
            <div className={`px-10 pt-2`}>
              <Progress
                value={studentCount + teacherCount}
                className="bg-red-200"
              >
                <div className="bg-blue-600 h-full" style={{ width: "70%" }} />
              </Progress>
            </div>
          </div>
          <div>
            <AdminSummaryCard
              icon={<FaCalendarAlt />}
              label="Attendance Records"
              value={"1000+"}
            />
            <div className={`px-10 pt-2`}>
              <Progress value={1000} className="bg-red-200">
                <div className="bg-blue-600 h-full" style={{ width: "70%" }} />
              </Progress>
            </div>
          </div>
        </div>

        {/* Attendance Chart */}
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">Attendance Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={studentCount}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Recent Students Table */}
        <Card>
          <CardContent className="overflow-x-auto p-4">
            <h3 className="text-lg font-semibold mb-4">Recent Students</h3>
            <table className="min-w-full text-sm text-left">
              <thead>
                <tr>
                  <th className="px-4 py-2 border-b">Name</th>
                  <th className="px-4 py-2 border-b">Grade</th>
                  <th className="px-4 py-2 border-b">Admission Year</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => {
                  return (
                    <tr className="hover:bg-gray-50" key={student._id}>
                      <td className="px-4 py-2 border-b">{student.name}</td>
                      <td className="px-4 py-2 border-b">
                        {student.currentStd}
                      </td>
                      <td className="px-4 py-2 border-b">
                        {student.admissionYear}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
