"use client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import api from "@/utils/axios";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { HiOutlineClipboardList } from "react-icons/hi";
import Sidebar from "./SideBar";

const AdminAttendanceManagement = () => {
  const [students, setStudents] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date());
  const [selectedBatch, setSelectedBatch] = useState("All Batches");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalStudents, setTotalStudents] = useState(0);

  const studentsPerPage = 5;
  const totalPages = Math.ceil(totalStudents / studentsPerPage);

  useEffect(() => {
    fetchStudents(currentPage);
  }, [currentPage]);

  const fetchStudents = async (page) => {
    setLoading(true);
    try {
      // const res = await api.get(
      //   `/all/students?page=${page}&limit=${studentsPerPage}`
      // );
      const [studentsData, batchesData] = await Promise.all([
        api.get(`/all/students?page=${page}&limit=${studentsPerPage}`),
        api.get(`/batches`),
      ]);
      setStudents(studentsData.data.students);
      setBatches(batchesData.data.batches);
      setTotalStudents(studentsData.data.totalStudents);
    } catch (err) {
      console.error("Failed to fetch students", err);
    } finally {
      setLoading(false);
    }
  };

  const presentCount = students.filter((s) => s.status === "Present").length;
  const absentCount = students.filter((s) => s.status === "Absent").length;
  const totalCount = totalStudents;
  const monthlyAverage = "92%";

  return (
    <div>
      <div className="md:w-64 h-screen fixed border-r bg-gray-100 z-10">
        <Sidebar />
      </div>
      <div className="p-6 md:ml-64">
        <h1 className="text-2xl font-bold mb-1">Attendance</h1>
        <p className="text-gray-600 mb-4">
          Track and manage student attendance records.
        </p>

        <div className="flex gap-2 flex-wrap mb-6">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[150px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "dd-MM-yyyy") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Select onValueChange={setSelectedBatch} defaultValue={"All Batches"}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Select Batch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Batches">All Batches</SelectItem>
              {batches.map((batch) => {
                return (
                  <SelectItem value="Batch A" key={batch._id}>
                    {batch.name}
                  </SelectItem>
                );
              })}
              {/* <SelectItem value="Batch B">Batch B</SelectItem>
              <SelectItem value="Batch C">Batch C</SelectItem> */}
            </SelectContent>
          </Select>

          <Button className="bg-black text-white hover:bg-black/90">
            Mark Attendance
          </Button>
          <Button variant="outline">Export</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-medium">Present Today</h3>
              <p className="text-2xl font-bold">{presentCount}</p>
              <p className="text-green-600 text-sm">
                {Math.round((presentCount / totalCount) * 100)}% of total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-medium">Absent Today</h3>
              <p className="text-2xl font-bold">{absentCount}</p>
              <p className="text-red-600 text-sm">
                {Math.round((absentCount / totalCount) * 100)}% of total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-medium">Monthly Average</h3>
              <p className="text-2xl font-bold">{monthlyAverage}</p>
              <p className="text-yellow-600 text-sm">Last 30 days</p>
            </CardContent>
          </Card>
        </div>

        <div className="overflow-x-auto border rounded-lg">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-4 py-2">Student</th>
                <th className="text-left px-4 py-2">ID</th>
                <th className="text-left px-4 py-2">Batch</th>
                <th className="text-left px-4 py-2">Status</th>
                <th className="text-left px-4 py-2">Time</th>
                <th className="text-left px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s._id}>
                  <td className="px-4 py-2">
                    <div className="font-medium">{s.name}</div>
                    <div className="text-gray-500 text-xs">{s.email}</div>
                  </td>
                  <td className="px-4 py-2">{s.studentId}</td>
                  <td className="px-4 py-2">
                    <div className="flex flex-wrap gap-1">
                      {s.batches.map((batch) => (
                        <span
                          key={batch._id}
                          className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-semibold"
                        >
                          {batch.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        s.status === "Present"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">{s.time || "-"}</td>
                  <td className="px-4 py-2">
                    <div className="flex gap-2 text-blue-600 text-sm">
                      <button className="flex items-center gap-1">
                        <FaEdit /> Edit
                      </button>
                      <button className="flex items-center gap-1">
                        <HiOutlineClipboardList /> History
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-between items-center mt-4 px-4 pb-4">
            <Button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAttendanceManagement;
