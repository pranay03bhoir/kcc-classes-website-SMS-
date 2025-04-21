"use client";

import { useEffect, useState } from "react";
import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaBook,
  FaUsers,
  FaCalendarAlt,
} from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import Sidebar from "@/Dashboard/AdminDashboard/SideBar";

const mockFetchSummary = () =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        students: 80,
        teachers: 15,
        subjects: 10,
        batches: 5,
        attendanceRecords: 2300,
        attendanceChart: [
          { date: "Apr 01", count: 150 },
          { date: "Apr 02", count: 160 },
          { date: "Apr 03", count: 170 },
          { date: "Apr 04", count: 145 },
          { date: "Apr 05", count: 180 },
        ],
      });
    }, 500);
  });

const AdminSummaryCard = ({ icon, label, value }) => (
  <Card className="shadow-md rounded-2xl p-4 flex items-center gap-4">
    <div className="text-2xl text-blue-600">{icon}</div>
    <CardContent className="p-0">
      <p className="text-sm text-gray-500">{label}</p>
      <h3 className="text-xl font-bold">{value}</h3>
    </CardContent>
  </Card>
);

export default function AdminDashboard() {
  const [summary, setSummary] = useState(null);
  const router = useRouter();

  // --- Auth Guard (optional) --- //
  // useEffect(() => {
  //   const token = localStorage.getItem("adminToken");
  //   if (!token) router.push("/admin/login");
  // }, [router]);

  useEffect(() => {
    mockFetchSummary().then((data) => setSummary(data));
  }, []);

  if (!summary) return <p className="p-6">Loading dashboard...</p>;

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 fixed h-full">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 bg-gray-100 p-6 space-y-6 overflow-y-auto">
        <h2 className="text-2xl font-bold">Admin Dashboard</h2>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 text-center">
          <AdminSummaryCard
            icon={<FaUserGraduate />}
            label="Total Students"
            value={summary.students}
          />
          <AdminSummaryCard
            icon={<FaChalkboardTeacher />}
            label="Total Teachers"
            value={summary.teachers}
          />
          <AdminSummaryCard
            icon={<FaBook />}
            label="Total Subjects"
            value={summary.subjects}
          />
          <AdminSummaryCard
            icon={<FaUsers />}
            label="Total Batches"
            value={summary.batches}
          />
          <AdminSummaryCard
            icon={<FaCalendarAlt />}
            label="Attendance Records"
            value={summary.attendanceRecords}
          />
        </div>

        {/* Attendance Chart */}
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">Attendance Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={summary.attendanceChart}>
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
                  <th className="px-4 py-2 border-b">Subject</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">Ravi Patil</td>
                  <td className="px-4 py-2 border-b">10</td>
                  <td className="px-4 py-2 border-b">Math</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">Sneha Joshi</td>
                  <td className="px-4 py-2 border-b">9</td>
                  <td className="px-4 py-2 border-b">Science</td>
                </tr>
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
