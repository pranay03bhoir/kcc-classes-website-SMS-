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
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import MarkAttendanceModal from "./components/modals/AddAttendanceModal";
import EditIndividualStudentModal from "./components/modals/EditIndivisualStudent";
import Sidebar from "./SideBar";

export default function AdminAttendanceManagement() {
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [selectedBatch, setSelectedBatch] = useState("All Batches");
  const [showModal, setShowModal] = useState(false);
  const [students, setStudents] = useState([]);
  const [batches, setBatches] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedAttendance, setSelectedAttendance] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalStudents, setTotalStudents] = useState(0);
  const itemsPerPage = 10;

  // Memoized filtered students based on batch selection, search, and status filter
  const filteredStudents = useMemo(() => {
    let filtered = [...students];

    // Apply batch filter
    if (selectedBatch !== "all" && selectedBatch !== "All Batches") {
      filtered = filtered.filter((student) =>
        student.batches?.some((batch) => batch._id === selectedBatch)
      );
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (student) =>
          student.name.toLowerCase().includes(query) ||
          student.studentId.toLowerCase().includes(query) ||
          student.email.toLowerCase().includes(query) ||
          student.batches?.some((batch) =>
            batch.name.toLowerCase().includes(query)
          )
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((student) => {
        const lastAttendance =
          Array.isArray(student.attendance) && student.attendance.length > 0
            ? student.attendance[student.attendance.length - 1]
            : null;
        return lastAttendance?.status === statusFilter;
      });
    }

    return filtered;
  }, [students, selectedBatch, searchQuery, statusFilter]);

  // Update totalStudents when filters change
  useEffect(() => {
    setTotalStudents(filteredStudents.length);
  }, [filteredStudents]);

  const totalPages = Math.ceil(totalStudents / itemsPerPage);
  const fetchStudentData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const toastId = toast.loading("Loading students...");

    try {
      const [studentData, batchData] = await Promise.all([
        api.get(`/all/students?page=${currentPage}&limit=${itemsPerPage}`),
        api.get("/batches"),
      ]);

      if (studentData.status === 200 && batchData.status === 200) {
        setStudents(studentData.data.students);
        setBatches(batchData.data.batches);
        setTotalStudents(studentData.data.totalStudents);
        console.log("Student data", studentData.data.students);
        toast.update(toastId, {
          render: "Students and batches loaded successfully!",
          type: "success",
          autoClose: 2000,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error(error);
      const message =
        error?.response?.data?.message || "Failed to load students.";
      setError(message);
      toast.update(toastId, {
        render: message,
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });

      if (error?.response?.status === 401) {
        try {
          await api.post("/refresh");
          setTimeout(() => window.location.reload(), 1000);
        } catch (refreshError) {
          console.error("Session refresh failed:", refreshError);
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, itemsPerPage]);
  const attendanceStats = useMemo(() => {
    const presentCount = students.filter((student) => {
      const lastAttendance =
        Array.isArray(student.attendance) && student.attendance.length > 0
          ? student.attendance[student.attendance.length - 1]
          : null;
      return (
        lastAttendance?.status === "Present" ||
        lastAttendance?.status === "Late"
      );
    }).length;

    const absentCount = students.filter((student) => {
      const lastAttendance =
        Array.isArray(student.attendance) && student.attendance.length > 0
          ? student.attendance[student.attendance.length - 1]
          : null;
      return lastAttendance?.status === "Absent";
    }).length;

    const lateCount = students.filter((student) => {
      const lastAttendance =
        Array.isArray(student.attendance) && student.attendance.length > 0
          ? student.attendance[student.attendance.length - 1]
          : null;
      return lastAttendance?.status === "Late";
    }).length;

    // Calculate daily attendance percentage
    const dailyAttendancePercentage =
      students.length > 0
        ? ((presentCount + lateCount) / students.length) * 100
        : 0;

    // Note: For a true monthly average, we would need to fetch attendance data for the last 30 days
    // This is currently just showing the daily percentage
    return {
      presentCount,
      absentCount,
      lateCount,
      monthlyAvg: dailyAttendancePercentage,
    };
  }, [students]);
  /**
   * The function `addAttendance` is an async function that adds attendance data for students and
   * displays corresponding toast messages based on the success or failure of the operation.
   */
  const addAttendance = async (attendanceData) => {
    const toastId = toast.loading("Adding attendance...");
    try {
      const response = await api.post("/students/attendance", attendanceData);

      if (response.status === 200 || response.status === 201) {
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

  const handleEditClick = (student) => {
    const lastAttendance =
      Array.isArray(student.attendance) && student.attendance.length > 0
        ? student.attendance[student.attendance.length - 1]
        : null;
    setSelectedStudent(student);
    setSelectedAttendance(lastAttendance);
    setEditModalOpen(true);
  };

  const handleUpdateAttendance = async (updateData) => {
    const toastId = toast.loading("Updating attendance...");
    try {
      // Get the attendance ID from the selected attendance
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

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    if (isValid(parseISO(newDate))) {
      setDate(newDate);
    } else {
      toast.error("Please select a valid date");
    }
  };

  const handleBatchChange = (value) => {
    setSelectedBatch(value);
    setCurrentPage(1); // Reset to first page when changing batch
  };

  // const handlePageChange = (newPage) => {
  //   setCurrentPage(newPage);
  // };

  const handleExport = async () => {
    const toastId = toast.loading("Preparing export...");
    try {
      // Since there's no direct export endpoint, we'll fetch the attendance data and create a CSV
      const response = await api.get("/admin/attendance/records", {
        params: {
          date,
          batchId: selectedBatch !== "All Batches" ? selectedBatch : undefined,
        },
      });

      if (response.status === 200) {
        // Create CSV content
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
              record.student.batches?.length > 0
                ? record.student.batches.map((batch) => batch.name).join(", ")
                : "N/A",
              record.status,
              format(new Date(record.date), "yyyy-MM-dd"),
              format(new Date(record.date), "HH:mm:ss"),
            ].join(",")
          ),
        ].join("\n");

        // Create and trigger download
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
      console.error("Error exporting attendance:", error);
      toast.update(toastId, {
        render:
          error?.response?.data?.message || "Failed to export attendance.",
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setCurrentPage(1); // Reset to first page when filtering
  };

  useEffect(() => {
    fetchStudentData(currentPage);
  }, [fetchStudentData, currentPage]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Error Loading Data
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={fetchStudentData}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <ToastContainer position="top-center" />
      <div className="w-full md:w-64 fixed h-full z-30">
        <Sidebar />
      </div>

      <div className="flex-1 md:ml-64 bg-[#f9fafb] p-4 md:p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header Section */}
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

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Present Today
                    </p>
                    <h3 className="text-2xl font-bold text-green-600">
                      {attendanceStats.presentCount}
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
                      {attendanceStats.absentCount}
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
                      {attendanceStats.lateCount}
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
                      {attendanceStats.monthlyAvg.toFixed(1)}%
                    </h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters Section */}
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
                      <SelectItem value="All Batches">All Batches</SelectItem>
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
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-full"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Students Table */}
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
                      {filteredStudents
                        .slice(
                          (currentPage - 1) * itemsPerPage,
                          currentPage * itemsPerPage
                        )
                        .map((student) => {
                          const lastAttendance = getLastAttendance(student);
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
                                    lastAttendance?.status === "Present"
                                      ? "success"
                                      : lastAttendance?.status === "Late"
                                      ? "warning"
                                      : "destructive"
                                  }
                                >
                                  {lastAttendance?.status || "Not Marked"}
                                </Badge>
                              </td>
                              <td className="p-4">
                                {lastAttendance?.updatedAt
                                  ? format(
                                      typeof lastAttendance.updatedAt ===
                                        "string"
                                        ? parseISO(lastAttendance.updatedAt)
                                        : new Date(lastAttendance.updatedAt),
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

              {/* Pagination */}
              {!isLoading && !error && filteredStudents.length > 0 && (
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

      {/* Modals */}
      <MarkAttendanceModal
        open={showModal}
        onClose={() => setShowModal(false)}
        students={filteredStudents}
        setStudents={setStudents}
        onSaveAttendance={addAttendance}
        batch={
          selectedBatch !== "All Batches"
            ? batches.find((b) => b._id === selectedBatch)
            : null
        }
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
        batch={
          selectedBatch !== "All Batches"
            ? batches.find((b) => b._id === selectedBatch)
            : null
        }
      />
    </div>
  );
}

const getLastAttendance = (student) => {
  return Array.isArray(student.attendance) && student.attendance.length > 0
    ? student.attendance[student.attendance.length - 1]
    : null;
};
