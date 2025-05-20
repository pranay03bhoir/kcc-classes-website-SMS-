"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import api from "@/utils/axios";
import { startOfDay } from "date-fns";
import moment from "moment";
import { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { FaSearch } from "react-icons/fa";
import Sidebar from "./SideBar";

const localizer = momentLocalizer(moment);
const attendanceOptions = ["Absent", "Present", "Late", "Other"];

const AdminAttendanceManagement = () => {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [customNotes, setCustomNotes] = useState({});
  const [events, setEvents] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 5;
  const [totalStudents, setTotalStudents] = useState(0);
  const totalPages = Math.ceil(totalStudents / studentsPerPage);
  const [loading, setLoading] = useState(false);

  const fetchStudents = async (page) => {
    setLoading(true);
    try {
      const res = await api.get(
        `/all/students?page=${page}&limit=${studentsPerPage}`
      );
      setStudents(res.data.students);
      setTotalStudents(res.data.totalStudents);

      const defaultAttendance = {};
      setAttendance(defaultAttendance);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents(currentPage);
  }, [currentPage]);

  const handleChange = (id, value) => {
    setAttendance((prev) => ({ ...prev, [id]: value }));
  };

  const handleNoteChange = (id, note) => {
    setCustomNotes((prev) => ({ ...prev, [id]: note }));
  };

  const handleSubmit = () => {
    const today = startOfDay(new Date());
    const newEvents = students.map((student) => {
      const status = attendance[student._id];
      const note = customNotes[student._id];
      return {
        title: `Name: ${student.name}, ID: ${student.studentId}${
          status === "Other" && note ? `, Note: ${note}` : ""
        }`,
        start: today,
        end: today,
        status,
        allDay: true,
      };
    });
    setEvents((prev) => [...prev, ...newEvents]);
    alert("Attendance submitted!");
  };

  return (
    <div>
      <div className="md:w-64 h-screen fixed border-r bg-gray-100 z-10">
        <Sidebar />
      </div>
      <div className="p-6 md:ml-64">
        <h1 className="text-2xl font-bold mb-4">Mark Student Attendance</h1>
        <Card>
          <CardContent className="overflow-auto p-4">
            <form>
              <div className="flex">
                <Input
                  type="text"
                  placeholder="Search student"
                  className={`mb-5`}
                />
                <Button className="ml-2">
                  Search
                  <FaSearch className=" text-gray-500" />
                </Button>
              </div>
            </form>
            {loading ? (
              <p>Loading students...</p>
            ) : (
              <>
                <table className="min-w-full text-sm border border-gray-300">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="text-left px-4 py-2 border">ID</th>
                      <th className="text-left px-4 py-2 border">Name</th>
                      <th className="text-center px-4 py-2 border">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr key={student._id} className="border-b">
                        <td className="px-4 py-2 border">
                          {student.studentId}
                        </td>
                        <td className="px-4 py-2 border">{student.name}</td>
                        <td className="text-center px-4 py-2 border">
                          <div className="flex flex-col items-center">
                            <select
                              value={attendance[student._id] || ""}
                              onChange={(e) =>
                                handleChange(student._id, e.target.value)
                              }
                              className="border rounded px-2 py-1 text-sm"
                            >
                              {attendanceOptions.map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>

                            {attendance[student._id] === "Other" && (
                              <input
                                type="text"
                                placeholder="Enter note"
                                value={customNotes[student._id] || ""}
                                onChange={(e) =>
                                  handleNoteChange(student._id, e.target.value)
                                }
                                className="mt-2 border rounded px-2 py-1 text-sm w-full"
                              />
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination controls */}
                <div className="flex justify-between items-center mt-4">
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
                    onClick={() =>
                      setCurrentPage((p) => Math.min(p + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>

                <div className="mt-6 flex justify-end">
                  <Button onClick={handleSubmit}>Submit Attendance</Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Attendance Calendar</h2>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminAttendanceManagement;
