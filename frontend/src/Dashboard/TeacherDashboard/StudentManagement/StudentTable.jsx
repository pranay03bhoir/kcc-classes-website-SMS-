"use client";
import api from "@/utils/teacher-axios";
import PropTypes from "prop-types";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import Sidebar from "../SideBar";
import StudentDetailsViewModal from "./modals/StudentDetailsViewModal";
import EditStudentModal from "./modals/StudentUpdateModal";

const ITEMS_PER_PAGE = 10;

export default function StudentTable({ students, teacher }) {
  const [search, setSearch] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("All");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [batchList, setBatchList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });
  const [isLoading, setIsLoading] = useState(false);

  /**
   * The function fetches batches data from an API endpoint and sets the batch list in the component
   * state.
   */
  const fetchBatches = async () => {
    try {
      const response = await api.get("get/batches"); // ✅ Added await
      setBatchList(response.data.batches);
    } catch (error) {
      console.error("Error fetching batches:", error);
    }
  };

  /**
   * The function `handleSaveEdit` is an asynchronous function that updates a student's data via an API
   * call and displays a toast notification based on the response status.
   */
  const handleSaveEdit = async (updatedData) => {
    const toastId = toast.loading("Updating student...");
    try {
      const studentId = selectedStudent._id;
      const response = await api.put(
        `/update/student/${studentId}`,
        updatedData
      );

      if (response.status === 200) {
        toast.update(toastId, {
          render: response?.data?.message,
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
        setIsEditModalOpen(false);
      } else {
        toast.update(toastId, {
          render: response?.data?.message,
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      }
    } catch (error) {
      const message = error?.response?.data?.message || "Something went wrong";
      toast.update(toastId, {
        render: message,
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };
  useEffect(() => {
    fetchBatches();
  }, []);

  const handleSort = useCallback((key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === "asc"
          ? "desc"
          : "asc",
    }));
  }, []);

  const studentList = useMemo(
    () => students.flatMap((student) => student.studentIds),
    [students]
  );

  const filteredAndSortedStudents = useMemo(() => {
    let filtered = studentList.filter((student) => {
      const searchLower = search.toLowerCase();
      const matchesSearch =
        student.name.toLowerCase().includes(searchLower) ||
        student.email.toLowerCase().includes(searchLower) ||
        student.studentId.toLowerCase().includes(searchLower);

      const matchesBatch =
        selectedBatch === "All" ||
        student.batches.some((batch) => batch.name === selectedBatch);

      return matchesSearch && matchesBatch;
    });

    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Handle nested properties
        if (sortConfig.key === "attendance") {
          aValue = a.attendance?.[a.attendance.length - 1]?.status || "N/A";
          bValue = b.attendance?.[b.attendance.length - 1]?.status || "N/A";
        } else if (sortConfig.key === "batches") {
          // Sort by the first batch name if available
          aValue = a.batches?.[0]?.name || "";
          bValue = b.batches?.[0]?.name || "";
        }

        // Handle numeric values
        if (sortConfig.key === "avgScore") {
          aValue = aValue || 0;
          bValue = bValue || 0;
          return sortConfig.direction === "asc"
            ? aValue - bValue
            : bValue - aValue;
        }

        // Handle string values
        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortConfig.direction === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        // Fallback comparison
        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [studentList, search, selectedBatch, sortConfig]);

  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedStudents.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE
    );
  }, [filteredAndSortedStudents, currentPage]);

  const totalPages = Math.ceil(
    filteredAndSortedStudents.length / ITEMS_PER_PAGE
  );

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="fixed h-screen bg-gray-100 hidden md:block">
        <Sidebar teacher={teacher} />
      </div>
      <div className="p-4 md:p-6 md:ms-64">
        <header className="mb-4 md:mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">
            Students
          </h1>
          <p className="text-xs md:text-sm text-gray-600">
            Manage your students and view their details.
          </p>
        </header>

        {/* Search and Batch Filter */}
        <div className="flex flex-col gap-4 mb-4 md:mb-6">
          <div className="w-full">
            <label htmlFor="search" className="sr-only">
              Search students
            </label>
            <input
              id="search"
              type="text"
              placeholder="Search by name, email, or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border rounded-md px-3 md:px-4 py-2 text-sm md:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              aria-label="Search students"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <div className="w-full sm:w-1/2">
              <label htmlFor="batch-filter" className="sr-only">
                Filter by batch
              </label>
              <select
                id="batch-filter"
                className="w-full border rounded-md px-3 md:px-4 py-2 text-sm md:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
                aria-label="Filter by batch"
              >
                <option value="All">All Batches</option>
                {batchList
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((batch) => (
                    <option key={batch._id} value={batch.name}>
                      {batch.name}
                    </option>
                  ))}
              </select>
            </div>
            <button
              className="w-full sm:w-auto bg-blue-600 text-white px-3 md:px-4 py-2 rounded-md text-sm md:text-base hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              aria-label="Add new student"
            >
              + Add Student
            </button>
          </div>
        </div>

        {/* Student Table */}
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <div className="min-w-full inline-block align-middle">
            <div className="overflow-x-auto">
              <table
                className="min-w-full divide-y divide-gray-200"
                role="grid"
              >
                <thead className="bg-gray-50">
                  <tr>
                    {[
                      {
                        key: "studentId",
                        label: "ID",
                        sortable: true,
                        className: "hidden sm:table-cell",
                      },
                      { key: "name", label: "Name", sortable: true },
                      {
                        key: "batches",
                        label: "Batch",
                        sortable: true,
                        className: "hidden md:table-cell",
                      },
                      {
                        key: "attendance",
                        label: "Attendance",
                        sortable: true,
                        className: "hidden lg:table-cell",
                      },
                      {
                        key: "avgScore",
                        label: "Avg. Score",
                        sortable: true,
                        className: "hidden lg:table-cell",
                      },
                      { key: "actions", label: "Actions", sortable: false },
                    ].map(({ key, label, sortable, className = "" }) => (
                      <th
                        key={key}
                        className={`px-3 md:px-4 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                          sortable ? "cursor-pointer hover:bg-gray-100" : ""
                        } ${className}`}
                        onClick={() => sortable && handleSort(key)}
                        role="columnheader"
                        aria-sort={
                          sortConfig.key === key ? sortConfig.direction : "none"
                        }
                      >
                        <div className="flex items-center gap-1">
                          {label}
                          {sortable && sortConfig.key === key && (
                            <span aria-hidden="true" className="text-blue-600">
                              {sortConfig.direction === "asc" ? "↑" : "↓"}
                            </span>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {isLoading ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-3 md:px-4 py-6 md:py-8 text-center text-gray-500"
                      >
                        Loading students...
                      </td>
                    </tr>
                  ) : paginatedStudents.length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-3 md:px-4 py-6 md:py-8 text-center text-gray-500"
                      >
                        No students found
                      </td>
                    </tr>
                  ) : (
                    paginatedStudents.map((student) => (
                      <tr key={student._id} className="hover:bg-gray-50">
                        <td className="hidden sm:table-cell px-3 md:px-4 py-2 md:py-3 text-sm">
                          {student.studentId}
                        </td>
                        <td className="px-3 md:px-4 py-2 md:py-3">
                          <div className="flex items-center space-x-2 md:space-x-3">
                            <div className="bg-gray-200 rounded-full w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-xs md:text-sm font-medium">
                              {student.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()}
                            </div>
                            <div>
                              <div className="font-medium text-sm md:text-base">
                                {student.name}
                              </div>
                              <div className="text-xs md:text-sm text-gray-500">
                                {student.email}
                              </div>
                              <div className="sm:hidden text-xs text-gray-500 mt-1">
                                ID: {student.studentId}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="hidden md:table-cell px-3 md:px-4 py-2 md:py-3">
                          <div className="flex flex-wrap gap-1">
                            {student.batches.map((batch) => (
                              <span
                                key={batch._id || batch.name}
                                className="bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-1 rounded-full"
                              >
                                {batch.name}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="hidden lg:table-cell px-3 md:px-4 py-2 md:py-3">
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
                        <td className="hidden lg:table-cell px-3 md:px-4 py-2 md:py-3 text-sm">
                          {student.avgScore}
                        </td>
                        <td className="px-3 md:px-4 py-2 md:py-3">
                          <div className="flex flex-col sm:flex-row gap-2 text-xs md:text-sm">
                            <button
                              className="text-blue-600 font-medium hover:underline cursor-pointer"
                              onClick={() => {
                                setSelectedStudent(student);
                                setIsViewModalOpen(true);
                              }}
                            >
                              View
                            </button>
                            <button
                              className="text-gray-600 hover:underline cursor-pointer"
                              onClick={() => {
                                setSelectedStudent(student);
                                setIsEditModalOpen(true);
                              }}
                            >
                              Edit
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
        {totalPages > 1 && (
          <nav
            className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4"
            aria-label="Pagination"
          >
            <div className="text-xs md:text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">
                {(currentPage - 1) * ITEMS_PER_PAGE + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(
                  currentPage * ITEMS_PER_PAGE,
                  filteredAndSortedStudents.length
                )}
              </span>{" "}
              of{" "}
              <span className="font-medium">
                {filteredAndSortedStudents.length}
              </span>{" "}
              results
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-2 md:px-3 py-1 text-xs md:text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 focus:ring-2 focus:ring-blue-500"
                aria-label="Previous page"
              >
                Previous
              </button>
              <div className="flex flex-wrap justify-center gap-1 md:gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-2 md:px-3 py-1 text-xs md:text-sm border rounded-md ${
                        currentPage === page
                          ? "bg-blue-600 text-white"
                          : "hover:bg-gray-100"
                      } focus:ring-2 focus:ring-blue-500`}
                      aria-label={`Page ${page}`}
                      aria-current={currentPage === page ? "page" : undefined}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-2 md:px-3 py-1 text-xs md:text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 focus:ring-2 focus:ring-blue-500"
                aria-label="Next page"
              >
                Next
              </button>
            </div>
          </nav>
        )}
      </div>

      {/* Edit Modal */}
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
              name: PropTypes.string.isRequired,
            })
          ),
          attendance: PropTypes.arrayOf(
            PropTypes.shape({
              status: PropTypes.oneOf(["Present", "Absent", "Late"]).isRequired,
            })
          ),
          avgScore: PropTypes.number,
          attendedDays: PropTypes.number,
        })
      ).isRequired,
    })
  ).isRequired,
  teacher: PropTypes.object.isRequired,
};
