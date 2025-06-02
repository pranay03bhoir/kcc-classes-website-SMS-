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
import api from "@/utils/teacher-axios";
import { Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import Sidebar from "../SideBar";
import MarkAttendanceModal from "./Modals/AddAttendanceModal";
import EditIndividualStudentModal from "./Modals/EditIndivisualStudent";

export default function AttendancePage() {
  const [date, setDate] = useState("");
  const [batch, setBatch] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [students, setStudents] = useState([]);
  const [teacher, setTeacher] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedAttendance, setSelectedAttendance] = useState(null);
  /**
   * The function `fetchStudentData` asynchronously fetches student data from an API and displays a
   * loading message, success message, or error message using a toast notification.
   */
  const fetchStudentData = async () => {
    const toastId = toast.loading("Loading students...");
    try {
      const response = await api.get("get/teacher/details");
      setStudents(response.data.teacher.batches);
      setBatch(response.data.teacher.batches);
      setTeacher(response.data.teacher);
      if (response.status === 200) {
        toast.update(toastId, {
          render: response?.data?.message || "Students loaded successfully!",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.error(error);
      if (error?.response?.status >= 400 && error?.response?.status < 500) {
        const refreshSession = await api.post("/refresh");
        setTimeout(() => {
          window.location.reload();
        }, 1);
      }
      const message =
        error?.response?.data?.message || "Failed to load students.";
      toast.update(toastId, {
        render: message,
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    }
  };

  /**
   * The function `addAttendance` is an asynchronous function that adds attendance data for students and
   * displays corresponding toast messages based on the success or failure of the operation.
   */
  const addAttendance = async (attendanceData) => {
    // console.log("Starting addAttendance with data:", attendanceData);
    const toastId = toast.loading("Adding attendance...");
    try {
      console.log("Making API request to /students/attendance");
      const response = await api.post("/students/attendance", attendanceData);
      console.log("API Response:", response);

      if (response.status === 200 || response.status === 201) {
        console.log("Attendance added successfully");
        toast.update(toastId, {
          render: response?.data?.message || "Attendance added successfully!",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
        setShowModal(false);
        fetchStudentData(); // Refresh student data after adding attendance
      }
    } catch (error) {
      console.error("Error adding attendance:", error);
      const message =
        error?.response?.data?.message || "Failed to add attendance.";
      toast.update(toastId, {
        render: message,
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, []);
  // console.log(
  //   "Students Data:",
  //   students.map(
  //     (student) =>
  //       student.attendance?.[student.attendance.length - 1]?.status ===
  //       "Present"
  //   )
  // );
  const studentList = students.flatMap((student) => student.studentIds);
  const presentCount = studentList.filter((student) =>
    student.attendance?.some(
      (record) => record.status === "Present" || record.status === "Late"
    )
  ).length;
  const absentCount = studentList.length - presentCount;
  const monthlyAvg = (presentCount / 20) * 50;

  const handleEditClick = (student) => {
    setSelectedStudent(student);
    setSelectedAttendance(
      student.attendance?.[student.attendance.length - 1] || null
    );
    setEditModalOpen(true);
  };

  const handleUpdateAttendance = async (updateData) => {
    const toastId = toast.loading("Updating attendance...");
    try {
      const response = await api.post("/students/attendance", updateData);
      if (response.status === 200) {
        toast.update(toastId, {
          render: response?.data?.message || "Attendance updated successfully!",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
        setEditModalOpen(false);
        fetchStudentData(); // Refresh the data
      }
    } catch (error) {
      console.error("Error updating attendance:", error);
      toast.update(toastId, {
        render:
          error?.response?.data?.message || "Failed to update attendance.",
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    }
  };

  return (
    <div>
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
      <div className="fixed">
        <Sidebar teacher={teacher} />
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
              {batch.map((batch) => (
                <SelectItem value="Batch A" key={batch._id}>
                  {batch.name}
                </SelectItem>
              ))}
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
                {((presentCount / students.length) * 50).toFixed(0)}% of total
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <p className="text-gray-500">Absent Today</p>
              <h2 className="text-2xl font-bold">{absentCount}</h2>
              <p className="text-sm text-red-600">
                {((absentCount / students.length) * 50).toFixed(0)}% of total
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
              {studentList.map((student, idx) => (
                <tr key={idx} className="border-t">
                  <td className="p-3">
                    <div>
                      <div className="font-medium">{student.name}</div>
                      <div className="text-gray-500 text-xs">
                        {student.email}
                      </div>
                    </div>
                  </td>
                  <td className="p-3">{student.studentId}</td>
                  <td className="p-3">
                    <span className="px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-700">
                      {batch.map((batch) => batch.name).join(", ")}
                    </span>
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        student.attendance?.[student.attendance.length - 1]
                          ?.status === "Absent"
                          ? "bg-red-100/50 text-red-800"
                          : student.attendance?.[student.attendance.length - 1]
                              ?.status === "Late"
                          ? "bg-yellow-100/50 text-yellow-800"
                          : student.attendance?.[student.attendance.length - 1]
                              ?.status === "Present"
                          ? "bg-green-100/50 text-green-800"
                          : "bg-gray-100/50 text-gray-800"
                      }`}
                    >
                      {student.attendance?.[student.attendance.length - 1]
                        ?.status || "N/A"}
                    </span>
                  </td>
                  <td className="p-3">{student.time}</td>
                  <td className="p-3 space-x-2">
                    <button
                      className="text-blue-600 hover:underline"
                      onClick={() => handleEditClick(student)}
                    >
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
          <span>Showing 1 to 5 of {studentList.length} results</span>
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
        students={studentList}
        setStudents={setStudents}
        onSaveAttendance={addAttendance}
        batch={batch}
      />
      <EditIndividualStudentModal
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedStudent(null);
          setSelectedAttendance(null);
        }}
        student={selectedStudent}
        attendance={selectedAttendance}
        batch={batch}
        onSave={handleUpdateAttendance}
      />
    </div>
  );
}
