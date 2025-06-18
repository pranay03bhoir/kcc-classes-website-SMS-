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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTeacherAuth } from "@/hooks/useTeacherAuth";
import api from "@/utils/teacher-axios";
import { format, isValid, parseISO } from "date-fns";
import {
  Calendar,
  Download,
  Filter,
  Loader2,
  MoreVertical,
  Search as SearchIcon,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import Sidebar from "../SideBar";
import MarkAttendanceModal from "./Modals/AddAttendanceModal";
import EditIndividualStudentModal from "./Modals/EditIndivisualStudent";

export default function AttendancePage() {
  const { user: teacher, refreshToken } = useTeacherAuth();
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [selectedBatch, setSelectedBatch] = useState("All Batches");
  const [showModal, setShowModal] = useState(false);
  const [students, setStudents] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedAttendance, setSelectedAttendance] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const itemsPerPage = 10;

  // Memoized filtered students based on batch selection, search, and status filter
  const filteredStudents = useMemo(() => {
    let studentList = students.flatMap((batch) =>
      batch.studentIds.map((student) => ({
        ...student,
        batchName: batch.name,
        batchId: batch._id,
        lastAttendance:
          student.attendance?.[student.attendance.length - 1] || null,
      }))
    );

    // Apply batch filter
    if (selectedBatch !== "All Batches") {
      studentList = studentList.filter(
        (student) => student.batchId === selectedBatch
      );
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      studentList = studentList.filter(
        (student) =>
          student.name.toLowerCase().includes(query) ||
          student.studentId.toLowerCase().includes(query) ||
          student.email.toLowerCase().includes(query) ||
          student.batchName.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      studentList = studentList.filter(
        (student) => student.lastAttendance?.status === statusFilter
      );
    }

    return studentList;
  }, [students, selectedBatch, searchQuery, statusFilter]);

  // Memoized pagination calculations
  const paginationData = useMemo(() => {
    const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentStudents = filteredStudents.slice(startIndex, endIndex);

    return {
      currentStudents,
      totalPages,
      startIndex: startIndex + 1,
      endIndex: Math.min(endIndex, filteredStudents.length),
      totalItems: filteredStudents.length,
    };
  }, [filteredStudents, currentPage, itemsPerPage]);

  // Memoized attendance statistics
  const attendanceStats = useMemo(() => {
    const studentList = filteredStudents;
    const presentCount = studentList.filter(
      (student) =>
        student.lastAttendance?.status === "Present" ||
        student.lastAttendance?.status === "Late"
    ).length;
    const absentCount = studentList.filter(
      (student) => student.lastAttendance?.status === "Absent"
    ).length;
    const lateCount = studentList.filter(
      (student) => student.lastAttendance?.status === "Late"
    ).length;
    const monthlyAvg =
      studentList.length > 0 ? (presentCount / studentList.length) * 100 : 0;

    return { presentCount, absentCount, lateCount, monthlyAvg };
  }, [filteredStudents]);

  const fetchStudentData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const toastId = toast.loading("Loading students...");

    try {
      const response = await api.get("get/teacher/details");
      if (response.status === 200) {
        setStudents(response.data.teacher.batches);
        toast.update(toastId, {
          render: response?.data?.message || "Students loaded successfully!",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.error(error);

      // If it's an authentication error, try to refresh token
      if (error.response?.status === 401) {
        const refreshSuccess = await refreshToken();
        if (refreshSuccess) {
          // Retry the request after successful refresh
          fetchStudentData();
          return;
        }
      }

      const message =
        error?.response?.data?.message || "Failed to load students.";
      setError(message);
      toast.update(toastId, {
        render: message,
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    } finally {
      setIsLoading(false);
    }
  }, [refreshToken]);

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

      // If it's an authentication error, try to refresh token
      if (error.response?.status === 401) {
        const refreshSuccess = await refreshToken();
        if (refreshSuccess) {
          // Retry the request after successful refresh
          addAttendance(attendanceData);
          return;
        }
      }

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

      // If it's an authentication error, try to refresh token
      if (error.response?.status === 401) {
        const refreshSuccess = await refreshToken();
        if (refreshSuccess) {
          // Retry the request after successful refresh
          handleUpdateAttendance(updateData);
          return;
        }
      }

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

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleExport = async () => {
    const toastId = toast.loading("Preparing export...");
    try {
      const response = await api.get("/students/attendance/export", {
        params: {
          date,
          batchId: selectedBatch !== "All Batches" ? selectedBatch : undefined,
        },
        responseType: "blob",
      });

      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `attendance-report-${format(new Date(date), "yyyy-MM-dd")}.xlsx`
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
    } catch (error) {
      console.error("Error exporting attendance:", error);

      // If it's an authentication error, try to refresh token
      if (error.response?.status === 401) {
        const refreshSuccess = await refreshToken();
        if (refreshSuccess) {
          // Retry the request after successful refresh
          handleExport();
          return;
        }
      }

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
    fetchStudentData();
  }, [fetchStudentData]);

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
    <div className="min-h-screen bg-gray-50 pt-16">
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

      {/* Sidebar - Fixed on desktop, overlay on mobile */}
      <div className="fixed inset-y-0 left-0 z-40 md:relative md:z-auto">
        <Sidebar teacher={teacher} />
      </div>

      {/* Main content area - Properly positioned for mobile and desktop */}
      <div className="flex-1 w-full md:ml-16 p-4 sm:p-6 space-y-4 sm:space-y-6 transition-all duration-300">
        <header className="space-y-2">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1
                className="text-xl sm:text-2xl font-bold"
                role="heading"
                aria-level="1"
              >
                Attendance Management
              </h1>
              <p className="text-sm sm:text-base text-gray-500">
                Track and manage student attendance records.
              </p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleExport}
                      disabled={isLoading}
                      className="w-full sm:w-auto"
                    >
                      <Download className="h-4 w-4" />
                      <span className="sm:hidden ml-2">Export</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Export Attendance Report</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </header>

        <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-start sm:items-center w-full sm:w-auto">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Calendar className="w-5 h-5 text-gray-500" aria-hidden="true" />
              <Input
                type="date"
                value={date}
                onChange={handleDateChange}
                className="w-full sm:w-[160px]"
                aria-label="Select date"
                max={format(new Date(), "yyyy-MM-dd")}
              />
            </div>

            <Select
              onValueChange={handleBatchChange}
              value={selectedBatch}
              aria-label="Select batch"
              className="w-full sm:w-[160px]"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Batch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Batches">All Batches</SelectItem>
                {[...students]
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((batch) => (
                    <SelectItem key={batch._id} value={batch._id}>
                      {batch.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>

            <div className="relative w-full sm:w-auto">
              <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search students..."
                value={searchQuery}
                onChange={handleSearch}
                className="pl-8 w-full sm:w-[200px]"
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filter by Status
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleStatusFilter("all")}>
                  All Status
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusFilter("Present")}>
                  Present
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusFilter("Absent")}>
                  Absent
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusFilter("Late")}>
                  Late
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Button
            onClick={() => setShowModal(true)}
            disabled={isLoading}
            aria-label="Mark attendance"
            className="w-full sm:w-auto"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Mark Attendance"
            )}
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="py-4">
              <p className="text-sm sm:text-base text-gray-500">
                Present Today
              </p>
              <h2 className="text-xl sm:text-2xl font-bold text-green-600">
                {attendanceStats.presentCount}
              </h2>
              <p className="text-xs sm:text-sm text-green-600">
                {filteredStudents.length > 0
                  ? (
                      (attendanceStats.presentCount / filteredStudents.length) *
                      100
                    ).toFixed(0)
                  : 0}
                % of total
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <p className="text-sm sm:text-base text-gray-500">Absent Today</p>
              <h2 className="text-xl sm:text-2xl font-bold text-red-600">
                {attendanceStats.absentCount}
              </h2>
              <p className="text-xs sm:text-sm text-red-600">
                {filteredStudents.length > 0
                  ? (
                      (attendanceStats.absentCount / filteredStudents.length) *
                      100
                    ).toFixed(0)
                  : 0}
                % of total
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <p className="text-sm sm:text-base text-gray-500">Late Today</p>
              <h2 className="text-xl sm:text-2xl font-bold text-yellow-600">
                {attendanceStats.lateCount}
              </h2>
              <p className="text-xs sm:text-sm text-yellow-600">
                {filteredStudents.length > 0
                  ? (
                      (attendanceStats.lateCount / filteredStudents.length) *
                      100
                    ).toFixed(0)
                  : 0}
                % of total
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <p className="text-sm sm:text-base text-gray-500">
                Monthly Average
              </p>
              <h2 className="text-xl sm:text-2xl font-bold text-blue-600">
                {attendanceStats.monthlyAvg.toFixed(0)}%
              </h2>
              <p className="text-xs sm:text-sm text-blue-600">Last 30 days</p>
            </CardContent>
          </Card>
        </div>

        <div className="overflow-x-auto border rounded-lg bg-white shadow-sm">
          <div className="min-w-full inline-block align-middle">
            <div className="overflow-hidden">
              <table
                className="min-w-full divide-y divide-gray-200"
                role="grid"
              >
                <thead className="bg-gray-100 text-gray-700 text-left">
                  <tr>
                    <th className="p-3 whitespace-nowrap" scope="col">
                      Student
                    </th>
                    <th
                      className="p-3 whitespace-nowrap hidden sm:table-cell"
                      scope="col"
                    >
                      ID
                    </th>
                    <th
                      className="p-3 whitespace-nowrap hidden md:table-cell"
                      scope="col"
                    >
                      Batch
                    </th>
                    <th className="p-3 whitespace-nowrap" scope="col">
                      Status
                    </th>
                    <th
                      className="p-3 whitespace-nowrap hidden lg:table-cell"
                      scope="col"
                    >
                      Time
                    </th>
                    <th className="p-3 whitespace-nowrap" scope="col">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginationData.currentStudents.map((student, idx) => (
                    <tr
                      key={student._id || idx}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 bg-gray-200 w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium text-gray-700">
                            {student.profileImage ? (
                              <img
                                src={student.profileImage}
                                alt={`${student.name}'s profile`}
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              <span className="text-gray-500">
                                {student.name
                                  .split(" ")
                                  .map((word) => word[0].toUpperCase())
                                  .join("")
                                  .slice(0, 2)}
                              </span>
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{student.name}</div>
                            <div className="text-gray-500 text-xs">
                              {student.email}
                            </div>
                            <div className="sm:hidden text-xs text-gray-500 mt-1">
                              ID: {student.studentId}
                            </div>
                            <div className="md:hidden text-xs text-gray-500">
                              Batch: {student.batchName || "N/A"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 hidden sm:table-cell">
                        {student.studentId}
                      </td>
                      <td className="p-3 hidden md:table-cell">
                        <Badge
                          variant="secondary"
                          className="bg-purple-100 text-purple-700"
                        >
                          {student.batchName || "N/A"}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <Badge
                          variant="secondary"
                          className={`${
                            student.lastAttendance?.status === "Absent"
                              ? "bg-red-100 text-red-800"
                              : student.lastAttendance?.status === "Late"
                              ? "bg-yellow-100 text-yellow-800"
                              : student.lastAttendance?.status === "Present"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {student.lastAttendance?.status || "N/A"}
                        </Badge>
                        <div className="lg:hidden text-xs text-gray-500 mt-1">
                          {student.lastAttendance?.time || "N/A"}
                        </div>
                      </td>
                      <td className="p-3 hidden lg:table-cell">
                        {student.lastAttendance?.time || "N/A"}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditClick(student)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Edit
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => {
                                  toast.info(
                                    "View history feature coming soon!"
                                  );
                                }}
                              >
                                View History
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  toast.info(
                                    "Export individual feature coming soon!"
                                  );
                                }}
                              >
                                Export Record
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {filteredStudents.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Loading students...</span>
              </div>
            ) : searchQuery ? (
              "No students found matching your search criteria."
            ) : (
              "No students found in the selected batch."
            )}
          </div>
        )}

        {filteredStudents.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 text-sm text-gray-600">
            <span className="text-center sm:text-left">
              Showing {paginationData.startIndex} to {paginationData.endIndex}{" "}
              of {paginationData.totalItems} results
            </span>
            <div
              className="flex flex-wrap items-center justify-center gap-1"
              role="navigation"
              aria-label="Pagination"
            >
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Previous page"
              >
                &lt;
              </Button>
              {Array.from(
                { length: paginationData.totalPages },
                (_, i) => i + 1
              )
                .filter((page) => {
                  return (
                    page === 1 ||
                    page === paginationData.totalPages ||
                    Math.abs(page - currentPage) <= 1
                  );
                })
                .map((page, index, array) => {
                  if (index > 0 && page - array[index - 1] > 1) {
                    return (
                      <span key={`ellipsis-${page}`} className="px-2">
                        ...
                      </span>
                    );
                  }
                  return (
                    <Button
                      key={page}
                      size="sm"
                      variant={page === currentPage ? "default" : "outline"}
                      onClick={() => handlePageChange(page)}
                      aria-label={`Page ${page}`}
                      aria-current={page === currentPage ? "page" : undefined}
                    >
                      {page}
                    </Button>
                  );
                })}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === paginationData.totalPages}
                aria-label="Next page"
              >
                &gt;
              </Button>
            </div>
          </div>
        )}
      </div>

      <MarkAttendanceModal
        open={showModal}
        onClose={() => setShowModal(false)}
        students={filteredStudents}
        setStudents={setStudents}
        onSaveAttendance={addAttendance}
        batch={students}
        selectedDate={date}
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
        batch={students}
        onSave={handleUpdateAttendance}
        selectedDate={date}
      />
    </div>
  );
}
