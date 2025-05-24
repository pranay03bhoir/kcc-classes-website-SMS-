// components/AttendancePage.jsx
"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "lucide-react";
import { useState } from "react";
import Sidebar from "../SideBar";
import MarkAttendanceModal from "./Modals/AddAttendanceModal";
import api from "@/utils/teacher-axios";

const studentsData = [
  {
    name: "John Smith",
    email: "john.smith@example.com",
    id: "ST12345",
    batch: "Batch A",
    status: "Present",
    time: "9:30 AM",
  },
  {
    name: "Alice Davis",
    email: "alice.davis@example.com",
    id: "ST12346",
    batch: "Batch B",
    status: "Present",
    time: "9:15 AM",
  },
  {
    name: "Robert Johnson",
    email: "robert.johnson@example.com",
    id: "ST12347",
    batch: "Batch A",
    status: "Absent",
    time: "-",
  },
  {
    name: "Emma Wilson",
    email: "emma.wilson@example.com",
    id: "ST12348",
    batch: "Batch C",
    status: "Present",
    time: "9:45 AM",
  },
  {
    name: "Michael Brown",
    email: "michael.brown@example.com",
    id: "ST12349",
    batch: "Batch B",
    status: "Absent",
    time: "-",
  },
];

export default function AttendancePage() {
  const fetchStudentData = async () => {
    try {
        const response = await api.get()
    } catch (error) {
      console.error(error);
    }
  };

  const [date, setDate] = useState("");
  const [batch, setBatch] = useState("All Batches");
  const [showModal, setShowModal] = useState(false);
  const [students, setStudents] = useState(studentsData);
  const presentCount = studentsData.filter(
    (s) => s.status === "Present"
  ).length;
  const absentCount = studentsData.length - presentCount;
  const monthlyAvg = 92;

  return (
    <div>
      <div className="fixed">
        <Sidebar />
      </div>
      <div className="p-6 space-y-6 ms-64">
        <h1 className="text-2xl font-bold">Attendance</h1>
        <p className="text-gray-500">
          Track and manage student attendance records.
        </p>

        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-500" />
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-[160px]"
            />
          </div>

          <Select onValueChange={setBatch} defaultValue="All Batches">
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Select Batch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Batches">All Batches</SelectItem>
              <SelectItem value="Batch A">Batch A</SelectItem>
              <SelectItem value="Batch B">Batch B</SelectItem>
              <SelectItem value="Batch C">Batch C</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={() => setShowModal(true)}>Mark Attendance</Button>
          <Button variant="outline">Export</Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="py-4">
              <p className="text-gray-500">Present Today</p>
              <h2 className="text-2xl font-bold">{presentCount}</h2>
              <p className="text-sm text-green-600">
                {((presentCount / studentsData.length) * 100).toFixed(0)}% of
                total
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <p className="text-gray-500">Absent Today</p>
              <h2 className="text-2xl font-bold">{absentCount}</h2>
              <p className="text-sm text-red-600">
                {((absentCount / studentsData.length) * 100).toFixed(0)}% of
                total
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <p className="text-gray-500">Monthly Average</p>
              <h2 className="text-2xl font-bold">{monthlyAvg}%</h2>
              <p className="text-sm text-yellow-600">Last 30 days</p>
            </CardContent>
          </Card>
        </div>

        <div className="overflow-x-auto border rounded-lg">
          <table className="min-w-full table-auto text-sm">
            <thead className="bg-gray-100 text-gray-700 text-left">
              <tr>
                <th className="p-3">Student</th>
                <th className="p-3">ID</th>
                <th className="p-3">Batch</th>
                <th className="p-3">Status</th>
                <th className="p-3">Time</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {studentsData.map((student, idx) => (
                <tr key={idx} className="border-t">
                  <td className="p-3">
                    <div>
                      <div className="font-medium">{student.name}</div>
                      <div className="text-gray-500 text-xs">
                        {student.email}
                      </div>
                    </div>
                  </td>
                  <td className="p-3">{student.id}</td>
                  <td className="p-3">
                    <span className="px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-700">
                      {student.batch}
                    </span>
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        student.status === "Present"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {student.status}
                    </span>
                  </td>
                  <td className="p-3">{student.time}</td>
                  <td className="p-3 space-x-2">
                    <button className="text-blue-600 hover:underline">
                      Edit
                    </button>
                    <button className="text-blue-600 hover:underline">
                      History
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center pt-4 text-sm text-gray-600">
          <span>Showing 1 to 5 of {studentsData.length} results</span>
          <div className="flex items-center space-x-1">
            <Button variant="outline" size="sm">
              &lt;
            </Button>
            <Button size="sm">1</Button>
            <Button variant="outline" size="sm">
              2
            </Button>
            <span>...</span>
            <Button variant="outline" size="sm">
              9
            </Button>
            <Button variant="outline" size="sm">
              &gt;
            </Button>
          </div>
        </div>
      </div>
      <MarkAttendanceModal
        open={showModal}
        onClose={() => setShowModal(false)}
        students={students}
        setStudents={setStudents}
      />
    </div>
  );
}
