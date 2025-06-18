"use client";
import { useTeacherAuth } from "@/hooks/useTeacherAuth";
import api from "@/utils/teacher-axios";
import PropTypes from "prop-types";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FiChevronDown,
  FiChevronUp,
  FiEdit2,
  FiEye,
  FiSearch,
} from "react-icons/fi";
import { toast } from "react-toastify";
import Sidebar from "../SideBar";
import StudentDetailsViewModal from "./modals/StudentDetailsViewModal";
import EditStudentModal from "./modals/StudentUpdateModal";

const ITEMS_PER_PAGE = 10;

export default function StudentTable({ students, teacher }) {
  const { refreshToken } = useTeacherAuth();
  const [search, setSearch] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("All");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [batchList, setBatchList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [error, setError] = useState(null);

  const fetchBatches = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get("get/batches");
      setBatchList(response.data.batches);
    } catch (error) {
      console.error("Error fetching batches:", error);

      // If it's an authentication error, try to refresh token
      if (error.response?.status === 401) {
        const refreshSuccess = await refreshToken();
        if (refreshSuccess) {
          // Retry the request after successful refresh
          fetchBatches();
          return;
        }
      }

      setError("Failed to load batches. Please try again later.");
      toast.error("Failed to load batches");
    } finally {
      setIsLoading(false);
    }
  }, [refreshToken]);

  const handleSaveEdit = useCallback(
    async (updatedData) => {
      const toastId = toast.loading("Updating student...");
      try {
        const studentId = selectedStudent._id;
        const response = await api.put(
          `/update/student/${studentId}`,
          updatedData
        );

        toast.update(toastId, {
          render: response?.data?.message || "Student updated successfully",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
        setIsEditModalOpen(false);
      } catch (error) {
        // If it's an authentication error, try to refresh token
        if (error.response?.status === 401) {
          const refreshSuccess = await refreshToken();
          if (refreshSuccess) {
            // Retry the request after successful refresh
            handleSaveEdit(updatedData);
            return;
          }
        }

        const message =
          error?.response?.data?.message || "Failed to update student";
        toast.update(toastId, {
          render: message,
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      }
    },
    [selectedStudent, refreshToken]
  );

  useEffect(() => {
    fetchBatches();
  }, [fetchBatches]);

  const studentList = useMemo(
    () => students.flatMap((student) => student.studentIds),
    [students]
  );

  const handleSort = useCallback((key) => {
    setSortConfig((currentSort) => ({
      key,
      direction:
        currentSort.key === key && currentSort.direction === "asc"
          ? "desc"
          : "asc",
    }));
  }, []);

  const sortedAndFilteredStudents = useMemo(() => {
    let filtered = studentList.filter((student) => {
      const matchesSearch =
        search === "" ||
        student.name.toLowerCase().includes(search.toLowerCase()) ||
        student.email.toLowerCase().includes(search.toLowerCase());

      const matchesBatch =
        selectedBatch === "All" ||
        student.batches.some((batch) => batch.name === selectedBatch);

      return matchesSearch && matchesBatch;
    });

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [studentList, search, selectedBatch, sortConfig]);

  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedAndFilteredStudents.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE
    );
  }, [sortedAndFilteredStudents, currentPage]);

  const totalPages = Math.ceil(
    sortedAndFilteredStudents.length / ITEMS_PER_PAGE
  );

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) return null;
    return sortConfig.direction === "asc" ? (
      <FiChevronUp className="inline ml-1" />
    ) : (
      <FiChevronDown className="inline ml-1" />
    );
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-700">
          {error}
          <button
            onClick={fetchBatches}
            className="ml-4 text-red-700 underline hover:text-red-800"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Sidebar - Fixed on desktop, overlay on mobile */}
      <div className="fixed inset-y-0 left-0 z-40 md:relative md:z-auto">
        <Sidebar teacher={teacher} />
      </div>

      {/* Main content area - Properly positioned for mobile and desktop */}
      <div className="flex-1 w-full md:ml-16 p-4 md:p-6">
        <h1 className="text-xl md:text-2xl font-bold mb-1">Students</h1>
        <p className="text-sm text-gray-600 mb-4">
          Manage your students and view their details.
        </p>

        {/* Search and Batch Filter */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4 z-0">
          <div className="relative w-full md:w-1/2">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search students..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border rounded-md pl-10 pr-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              aria-label="Search students"
            />
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <select
              className="border rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-auto"
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              aria-label="Select batch"
            >
              <option value="All">All Batches</option>
              {students.map((batch) => (
                <option key={batch._id || batch.name} value={batch.name}>
                  {batch.name}
                </option>
              ))}
            </select>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors w-full sm:w-auto"
              aria-label="Add new student"
            >
              + Add Student
            </button>
          </div>
        </div>

        {/* Student Table */}
        <div className="overflow-x-auto -mx-4 md:mx-0">
          <div className="min-w-full inline-block align-middle">
            <div className="overflow-hidden">
              <table className="min-w-full bg-white border rounded-md overflow-hidden shadow-sm">
                <thead className="bg-gray-100 text-gray-700 text-left">
                  <tr>
                    <th className="px-3 md:px-4 py-3 cursor-pointer hover:bg-gray-200 whitespace-nowrap">
                      ID <SortIcon columnKey="studentId" />
                    </th>
                    <th className="px-3 md:px-4 py-3 cursor-pointer hover:bg-gray-200 whitespace-nowrap">
                      Name <SortIcon columnKey="name" />
                    </th>
                    <th className="px-3 md:px-4 py-3 whitespace-nowrap">
                      Batch
                    </th>
                    <th className="px-3 md:px-4 py-3 cursor-pointer hover:bg-gray-200 whitespace-nowrap">
                      Attendance <SortIcon columnKey="attendedDays" />
                    </th>
                    <th className="px-3 md:px-4 py-3 cursor-pointer hover:bg-gray-200 whitespace-nowrap">
                      Avg. Score <SortIcon columnKey="avgScore" />
                    </th>
                    <th className="px-3 md:px-4 py-3 whitespace-nowrap">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-4 py-8 text-center text-gray-500"
                      >
                        Loading students...
                      </td>
                    </tr>
                  ) : paginatedStudents.length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-4 py-8 text-center text-gray-500"
                      >
                        No students found
                      </td>
                    </tr>
                  ) : (
                    paginatedStudents.map((student) => (
                      <tr
                        key={student._id}
                        className="border-t hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-3 md:px-4 py-3 whitespace-nowrap">
                          {student.studentId}
                        </td>
                        <td className="px-3 md:px-4 py-3">
                          <div className="flex items-center space-x-2 md:space-x-3">
                            <div className="bg-gray-200 rounded-full w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-xs md:text-sm font-medium">
                              {student.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <div className="font-medium truncate">
                                {student.name}
                              </div>
                              <div className="text-xs md:text-sm text-gray-500 truncate">
                                {student.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 md:px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {teacher.batches.map((batch) => (
                              <span
                                key={batch._id || batch.name}
                                className="bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-1 rounded-full"
                              >
                                {batch.name}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-3 md:px-4 py-3 whitespace-nowrap">
                          <div
                            className={`px-2 py-1 rounded-full text-xs text-center ${
                              student.attendance?.[
                                student.attendance.length - 1
                              ]?.status === "Absent"
                                ? "bg-red-100/50 text-red-800"
                                : student.attendance?.[
                                    student.attendance.length - 1
                                  ]?.status === "Late"
                                ? "bg-yellow-100/50 text-yellow-800"
                                : student.attendance?.[
                                    student.attendance.length - 1
                                  ]?.status === "Present"
                                ? "bg-green-100/50 text-green-800"
                                : "bg-gray-100/50 text-gray-800"
                            }`}
                          >
                            {student.attendance?.[student.attendance.length - 1]
                              ?.status || "N/A"}
                          </div>
                          <div className="text-xs md:text-sm text-gray-500">
                            {student.attendedDays}
                          </div>
                        </td>
                        <td className="px-3 md:px-4 py-3 whitespace-nowrap">
                          {student.avgScore || "N/A"}
                        </td>
                        <td className="px-3 md:px-4 py-3 whitespace-nowrap">
                          <div className="flex space-x-2 md:space-x-3">
                            <button
                              className="text-blue-600 hover:text-blue-800 transition-colors p-1 rounded-full hover:bg-blue-50"
                              onClick={() => {
                                setSelectedStudent(student);
                                setIsViewModalOpen(true);
                              }}
                              aria-label={`View details for ${student.name}`}
                            >
                              <FiEye className="w-4 h-4 md:w-5 md:h-5" />
                            </button>
                            <button
                              className="text-gray-600 hover:text-gray-800 transition-colors p-1 rounded-full hover:bg-gray-50"
                              onClick={() => {
                                setSelectedStudent(student);
                                setIsEditModalOpen(true);
                              }}
                              aria-label={`Edit ${student.name}`}
                            >
                              <FiEdit2 className="w-4 h-4 md:w-5 md:h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4 text-sm text-gray-600">
            <span className="text-center sm:text-left">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
              {Math.min(
                currentPage * ITEMS_PER_PAGE,
                sortedAndFilteredStudents.length
              )}{" "}
              of {sortedAndFilteredStudents.length} results
            </span>
            <div className="flex flex-wrap justify-center gap-1">
              <button
                className="px-2 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Previous page"
              >
                &lt;
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((page) => {
                  // Show first page, last page, current page, and pages around current page
                  return (
                    page === 1 ||
                    page === totalPages ||
                    Math.abs(page - currentPage) <= 1
                  );
                })
                .map((page, index, array) => {
                  // Add ellipsis if there are gaps
                  const showEllipsisBefore =
                    index > 0 && array[index - 1] !== page - 1;
                  const showEllipsisAfter =
                    index < array.length - 1 && array[index + 1] !== page + 1;

                  return (
                    <React.Fragment key={page}>
                      {showEllipsisBefore && (
                        <span className="px-2 py-1">...</span>
                      )}
                      <button
                        className={`px-3 py-1 border rounded ${
                          page === currentPage
                            ? "bg-blue-600 text-white"
                            : "hover:bg-gray-100"
                        }`}
                        onClick={() => handlePageChange(page)}
                        aria-label={`Go to page ${page}`}
                        aria-current={page === currentPage ? "page" : undefined}
                      >
                        {page}
                      </button>
                      {showEllipsisAfter && (
                        <span className="px-2 py-1">...</span>
                      )}
                    </React.Fragment>
                  );
                })}
              <button
                className="px-2 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Next page"
              >
                &gt;
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <EditStudentModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        student={selectedStudent}
        onSave={handleSaveEdit}
        batchList={batchList}
      />

      <StudentDetailsViewModal
        open={isViewModalOpen}
        onOpenChange={setIsViewModalOpen}
        student={selectedStudent}
        batchList={batchList}
      />
    </div>
  );
}

StudentTable.propTypes = {
  students: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      name: PropTypes.string.isRequired,
      studentIds: PropTypes.arrayOf(
        PropTypes.shape({
          _id: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
          email: PropTypes.string.isRequired,
          studentId: PropTypes.string.isRequired,
          batches: PropTypes.arrayOf(
            PropTypes.shape({
              _id: PropTypes.string,
              name: PropTypes.string.isRequired,
            })
          ).isRequired,
          attendance: PropTypes.arrayOf(
            PropTypes.shape({
              status: PropTypes.oneOf(["Present", "Absent", "Late"]),
              date: PropTypes.string,
            })
          ),
          attendedDays: PropTypes.number,
          avgScore: PropTypes.number,
        })
      ).isRequired,
    })
  ).isRequired,
  teacher: PropTypes.object.isRequired,
};
