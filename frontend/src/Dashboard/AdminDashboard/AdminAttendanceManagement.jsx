"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import api from "@/utils/axios";
import { format, isValid, parseISO } from "date-fns";
import {
  Calendar,
  Download,
  Loader2,
  MoreVertical,
  Search as SearchIcon,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import MarkAttendanceModal from "./components/modals/AddAttendanceModal";
import EditIndividualStudentModal from "./components/modals/EditIndivisualStudent";
import Sidebar from "./SideBar";

export default function AdminAttendanceManagement() {
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [selectedBatch, setSelectedBatch] = useState("");
  const [batches, setBatches] = useState([]);
  const [students, setStudents] = useState([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [attendanceStats, setAttendanceStats] = useState({
    present: 0,
    absent: 0,
    late: 0,
    monthlyAvg: 0,
  });
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedAttendance, setSelectedAttendance] = useState(null);
  const totalPages = Math.ceil(totalStudents / itemsPerPage);

  // Fetch batches on mount
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const res = await api.get("/batches");
        setBatches(res.data.batches || []);
        if (res.data.batches && res.data.batches.length > 0 && !selectedBatch) {
          setSelectedBatch(res.data.batches[0]._id);
        }
      } catch (e) {
        setError("Failed to load batches");
      }
    };
    fetchBatches();
  }, []);

  // Fetch students with filters
  const fetchStudents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        batchId: selectedBatch,
        status: statusFilter,
        search: searchQuery,
      };
      const res = await api.get("/filtered/students", { params });
      setStudents(res.data.students || []);
      setTotalStudents(res.data.total || 0);
    } catch (e) {
      setError("Failed to load students");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, itemsPerPage, selectedBatch, statusFilter, searchQuery]);

  // Fetch attendance stats
  const fetchStats = useCallback(async () => {
    if (!selectedBatch || !date) return;
    try {
      const params = { batchId: selectedBatch, date };
      const res = await api.get("/attendance/stats", { params });
      setAttendanceStats({
        present: res.data.present,
        absent: res.data.absent,
        late: res.data.late,
        monthlyAvg: res.data.monthlyAvg,
      });
    } catch (e) {
      setAttendanceStats({ present: 0, absent: 0, late: 0, monthlyAvg: 0 });
    }
  }, [selectedBatch, date]);

  useEffect(() => {
    fetchStudents();
    fetchStats();
  }, [fetchStudents, fetchStats]);

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    if (isValid(parseISO(newDate))) {
      setDate(newDate);
      setCurrentPage(1);
    } else {
      toast.error("Please select a valid date");
    }
  };

  const handleBatchChange = (value) => {
    setSelectedBatch(value);
    setCurrentPage(1);
  };

  const handleStatusFilter = (value) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleExport = async () => {
    const toastId = toast.loading("Preparing export...");
    try {
      const params = {
        date,
        batchId: selectedBatch,
        status: statusFilter !== "all" ? statusFilter : undefined,
      };
      const response = await api.get("/filtered/attendance", { params });
      if (response.status === 200) {
        const attendanceData = response.data.attendance;
        const headers = [
          "Student Name",
          "Student ID",
          "Batch",
          "Status",
          "Date",
          "Time",
        ];
        const csvContent = [
          headers.join(","),
          ...attendanceData.map((record) =>
            [
              record.student.name,
              record.student.studentId,
              record.student.batches?.map((batch) => batch.name).join(", ") ||
                "N/A",
              record.status,
              format(new Date(record.date), "yyyy-MM-dd"),
              format(new Date(record.date), "HH:mm:ss"),
            ].join(",")
          ),
        ].join("\n");
        const blob = new Blob([csvContent], {
          type: "text/csv;charset=utf-8;",
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `attendance-report-${format(new Date(date), "yyyy-MM-dd")}.csv`
        );
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        toast.update(toastId, {
          render: "Export completed successfully!",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
      }
    } catch (error) {
      toast.update(toastId, {
        render:
          error?.response?.data?.message || "Failed to export attendance.",
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    }
  };

  const handleEditClick = (student) => {
    // Find attendance for the selected date
    const attendanceForSelectedDate = Array.isArray(student.attendance)
      ? student.attendance.find((a) => {
          const attDate = new Date(a.date);
          const selDate = new Date(date);
          return (
            attDate.getFullYear() === selDate.getFullYear() &&
            attDate.getMonth() === selDate.getMonth() &&
            attDate.getDate() === selDate.getDate()
          );
        })
      : null;
    setSelectedStudent(student);
    setSelectedAttendance(attendanceForSelectedDate);
    setEditModalOpen(true);
  };

  const handleUpdateAttendance = async (updateData) => {
    const toastId = toast.loading("Updating attendance...");
    try {
      if (!selectedAttendance?._id) {
        throw new Error("No attendance record selected for update");
      }
      const response = await api.put(
        `/students/${updateData.student}/attendance/${selectedAttendance._id}`,
        {
          status: updateData.status,
          note: updateData.note,
        }
      );
      if (response.status === 200) {
        toast.update(toastId, {
          render: response?.data?.message || "Attendance updated successfully!",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
        setEditModalOpen(false);
        setSelectedStudent(null);
        setSelectedAttendance(null);
        fetchStudents();
        fetchStats();
      }
    } catch (error) {
      toast.update(toastId, {
        render:
          error?.response?.data?.message || "Failed to update attendance.",
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    }
  };

  // Add this function to POST attendance for each entry
  const handleSaveAttendance = async (entry) => {
    await api.post("/students/attendance", {
      ...entry,
      date: date, // Always send the selected date
    });
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Error Loading Data
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={fetchStudents}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 pt-16">
      <ToastContainer position="top-center" />
      <div className="fixed inset-y-0 left-0 z-40 md:relative md:z-auto">
        <Sidebar />
      </div>
      <div className="flex-1 w-full md:ml-16 bg-[#f9fafb] p-4 md:p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h1 className="text-xl md:text-2xl font-bold">
              Attendance Management
            </h1>
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <Button
                onClick={() => setShowModal(true)}
                className="w-full sm:w-auto"
              >
                Mark Attendance
              </Button>
              <Button
                variant="outline"
                onClick={handleExport}
                className="w-full sm:w-auto"
              >
                <Download className="mr-2 h-4 w-4" /> Export
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Present Today
                    </p>
                    <h3 className="text-2xl font-bold text-green-600">
                      {attendanceStats.present}
                    </h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Absent Today
                    </p>
                    <h3 className="text-2xl font-bold text-red-600">
                      {attendanceStats.absent}
                    </h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Late Today
                    </p>
                    <h3 className="text-2xl font-bold text-yellow-600">
                      {attendanceStats.late}
                    </h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Monthly Average
                    </p>
                    <h3 className="text-2xl font-bold text-blue-600">
                      {attendanceStats.monthlyAvg}%
                    </h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date</label>
                  <Input
                    type="date"
                    value={date}
                    onChange={handleDateChange}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Batch</label>
                  <Select
                    value={selectedBatch}
                    onValueChange={handleBatchChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select batch" />
                    </SelectTrigger>
                    <SelectContent>
                      {batches.map((batch) => (
                        <SelectItem key={batch._id} value={batch._id}>
                          {batch.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select
                    value={statusFilter}
                    onValueChange={handleStatusFilter}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="Present">Present</SelectItem>
                      <SelectItem value="Absent">Absent</SelectItem>
                      <SelectItem value="Late">Late</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Search</label>
                  <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search students..."
                      value={searchQuery}
                      onChange={handleSearch}
                      className="pl-10 w-full"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
              ) : error ? (
                <div className="text-center text-red-600 p-4">{error}</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4">Student</th>
                        <th className="text-left p-4">Batch</th>
                        <th className="text-left p-4">Status</th>
                        <th className="text-left p-4">Last Updated</th>
                        <th className="text-right p-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student) => {
                        // Find attendance for the selected date
                        const attendanceForSelectedDate = Array.isArray(
                          student.attendance
                        )
                          ? student.attendance.find((a) => {
                              const attDate = new Date(a.date);
                              const selDate = new Date(date);
                              return (
                                attDate.getFullYear() ===
                                  selDate.getFullYear() &&
                                attDate.getMonth() === selDate.getMonth() &&
                                attDate.getDate() === selDate.getDate()
                              );
                            })
                          : null;
                        return (
                          <tr
                            key={student._id}
                            className="border-b hover:bg-gray-50"
                          >
                            <td className="p-4">
                              <div>
                                <p className="font-medium">{student.name}</p>
                                <p className="text-sm text-gray-500">
                                  {student.studentId}
                                </p>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex flex-wrap gap-2">
                                {student.batches?.map((batch) => (
                                  <Badge
                                    key={batch._id}
                                    variant="secondary"
                                    className="whitespace-nowrap"
                                  >
                                    {batch.name}
                                  </Badge>
                                ))}
                              </div>
                            </td>
                            <td className="p-4">
                              <Badge
                                variant={
                                  attendanceForSelectedDate?.status ===
                                  "Present"
                                    ? "success"
                                    : attendanceForSelectedDate?.status ===
                                      "Late"
                                    ? "warning"
                                    : attendanceForSelectedDate?.status ===
                                      "Absent"
                                    ? "destructive"
                                    : "secondary"
                                }
                              >
                                {attendanceForSelectedDate?.status ||
                                  "Not Marked"}
                              </Badge>
                            </td>
                            <td className="p-4">
                              {attendanceForSelectedDate?.updatedAt
                                ? format(
                                    typeof attendanceForSelectedDate.updatedAt ===
                                      "string"
                                      ? parseISO(
                                          attendanceForSelectedDate.updatedAt
                                        )
                                      : new Date(
                                          attendanceForSelectedDate.updatedAt
                                        ),
                                    "MMM d, yyyy h:mm a"
                                  )
                                : "N/A"}
                            </td>
                            <td className="p-4 text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    className="h-8 w-8 p-0"
                                  >
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() => handleEditClick(student)}
                                  >
                                    Edit Attendance
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
              {!isLoading && !error && students.length > 0 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-gray-500">
                    Showing{" "}
                    {Math.min(
                      (currentPage - 1) * itemsPerPage + 1,
                      totalStudents
                    )}{" "}
                    to {Math.min(currentPage * itemsPerPage, totalStudents)} of{" "}
                    {totalStudents} students
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <MarkAttendanceModal
        open={showModal}
        onClose={() => setShowModal(false)}
        students={students}
        setStudents={setStudents}
        onSaveAttendance={handleSaveAttendance}
        batch={batches.find((b) => b._id === selectedBatch) || null}
        selectedDate={date}
      />
      <EditIndividualStudentModal
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedStudent(null);
          setSelectedAttendance(null);
        }}
        onSave={handleUpdateAttendance}
        student={selectedStudent}
        attendance={selectedAttendance}
        batch={batches.find((b) => b._id === selectedBatch) || null}
      />
    </div>
  );
}
