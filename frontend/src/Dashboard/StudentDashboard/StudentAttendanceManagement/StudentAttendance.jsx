"use client";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useStudentAuth } from "@/hooks/useStudentAuth";
import { useEffect, useState } from "react";
import {
  FaCheckCircle,
  FaClock,
  FaQuestionCircle,
  FaTimesCircle,
} from "react-icons/fa";
import api from "../../../utils/student-axios";
import Sidebar from "../SideBar";

const StudentAttendance = () => {
  const {
    user: studentData,
    isLoading: authLoading,
    isAuthenticated,
  } = useStudentAuth();
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const totalPages = Math.ceil(attendance.length / recordsPerPage);
  const paginatedAttendance = attendance.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  useEffect(() => {
    if (!studentData) return;
    const fetchAttendance = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get("/get/student/attendance");
        if (res.data.success) {
          setAttendance(res.data.attendance);
        } else {
          setError(res.data.message || "Failed to fetch attendance");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch attendance");
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, [studentData]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // Helper for Indian date format
  const formatIndianDate = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };
  const formatIndianDateTime = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return (
      d.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }) +
      ", " +
      d.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    );
  };

  // Calculate attendance summary
  const totalPresent = attendance.filter(
    (att) => att.status === "Present"
  ).length;
  const totalAbsent = attendance.filter(
    (att) => att.status === "Absent"
  ).length;
  const totalLate = attendance.filter((att) => att.status === "Late").length;
  const totalRecords = attendance.length;
  const attendanceRate =
    totalRecords > 0 ? ((totalPresent / totalRecords) * 100).toFixed(1) : "0.0";

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600 font-medium">
            Checking authentication...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600 font-medium">
            Redirecting to login...
          </p>
        </div>
      </div>
    );
  }

  if (loading) return <div>Loading attendance...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="relative flex min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 pt-16 overflow-hidden">
      {/* Sidebar - Hidden on mobile, visible on md+ */}
      <div className="fixed inset-y-0 left-0 z-40 md:relative md:z-auto">
        <Sidebar student={studentData} />
      </div>
      {/* Main content area */}
      <main className="relative flex-1 flex flex-col items-center justify-start z-10 p-2 sm:p-4 w-full">
        {/* Header Section */}
        <div className="w-full max-w-2xl mx-auto mb-6 flex flex-col items-center animate-fade-in px-2 sm:px-0">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-800 mb-1 tracking-tight drop-shadow-sm text-center">
            Attendance Records
          </h1>
          {studentData?.name && (
            <p className="text-gray-500 text-sm sm:text-base md:text-lg text-center">
              for{" "}
              <span className="font-semibold text-indigo-600">
                {studentData.name}
              </span>
            </p>
          )}
        </div>
        {/* Attendance Summary */}
        <div className="w-full max-w-2xl mx-auto mb-4 flex flex-wrap justify-center gap-2 sm:gap-4 animate-fade-in px-2 sm:px-0">
          <div className="flex items-center gap-1 sm:gap-2 bg-green-100 text-green-800 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg font-semibold shadow-sm text-xs sm:text-base min-w-0 flex-1 sm:flex-none justify-center">
            <FaCheckCircle className="text-green-500" /> Present: {totalPresent}
          </div>
          <div className="flex items-center gap-1 sm:gap-2 bg-red-100 text-red-800 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg font-semibold shadow-sm text-xs sm:text-base min-w-0 flex-1 sm:flex-none justify-center">
            <FaTimesCircle className="text-red-500" /> Absent: {totalAbsent}
          </div>
          <div className="flex items-center gap-1 sm:gap-2 bg-yellow-100 text-yellow-800 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg font-semibold shadow-sm text-xs sm:text-base min-w-0 flex-1 sm:flex-none justify-center">
            <FaClock className="text-yellow-500" /> Late: {totalLate}
          </div>
          <div className="flex items-center gap-1 sm:gap-2 bg-blue-100 text-blue-800 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg font-semibold shadow-sm text-xs sm:text-base min-w-0 flex-1 sm:flex-none justify-center">
            Attendance Rate: {attendanceRate}%
          </div>
        </div>
        {/* Attendance Table or Empty State */}
        {!attendance || attendance.length === 0 ? (
          <div className="flex flex-col items-center justify-center w-full max-w-md bg-white/90 rounded-2xl shadow-2xl p-4 sm:p-10 mt-8 animate-fade-in mx-2 sm:mx-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-14 w-14 text-indigo-200 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 17v-2a4 4 0 018 0v2m-4-4v-2a4 4 0 10-8 0v2m4-4V7a4 4 0 018 0v2"
              />
            </svg>
            <p className="text-gray-600 text-lg sm:text-xl font-semibold text-center">
              No attendance records found.
            </p>
            <p className="text-gray-400 text-xs sm:text-sm mt-2 text-center">
              Your attendance will appear here once available.
              <br />
              Keep up the good work and stay consistent!
            </p>
          </div>
        ) : (
          <div className="w-full animate-slide-up">
            <div className="overflow-x-auto w-full max-w-2xl mx-auto">
              <div className="bg-white/95 rounded-2xl shadow-lg p-2 sm:p-4 md:p-8 min-w-full sm:min-w-[600px] border border-gray-100">
                <table
                  className="w-full min-w-full sm:min-w-[600px] text-xs sm:text-sm rounded-xl border-separate border-spacing-0"
                  aria-label="Student Attendance Table"
                >
                  <thead className="sticky top-0 z-10">
                    <tr className="bg-gray-100">
                      <th className="py-2 sm:py-3 px-2 sm:px-4 font-bold text-gray-700 text-xs sm:text-base border-b border-gray-200 rounded-tl-xl">
                        Subject
                      </th>
                      <th className="py-2 sm:py-3 px-2 sm:px-4 font-bold text-gray-700 text-xs sm:text-base border-b border-gray-200">
                        Date
                      </th>
                      <th className="py-2 sm:py-3 px-2 sm:px-4 font-bold text-gray-700 text-xs sm:text-base border-b border-gray-200">
                        Status
                      </th>
                      <th className="py-2 sm:py-3 px-2 sm:px-4 font-bold text-gray-700 text-xs sm:text-base border-b border-gray-200">
                        Note
                      </th>
                      <th className="py-2 sm:py-3 px-2 sm:px-4 font-bold text-gray-700 text-xs sm:text-base border-b border-gray-200 rounded-tr-xl">
                        Recorded At
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedAttendance.map((att, idx) => (
                      <tr
                        key={idx + (currentPage - 1) * recordsPerPage}
                        className={`text-center transition-colors duration-150 ${
                          idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                        } hover:bg-indigo-50/60 border-b border-gray-100 last:border-b-0`}
                        style={{
                          borderRadius:
                            idx === paginatedAttendance.length - 1
                              ? "0 0 12px 12px"
                              : undefined,
                        }}
                      >
                        <td
                          className="whitespace-normal break-words py-2 sm:py-3 px-2 sm:px-4 text-gray-800 text-xs sm:text-sm"
                          aria-label="Subject"
                        >
                          {att.subjectName}
                        </td>
                        <td
                          className="whitespace-normal break-words py-2 sm:py-3 px-2 sm:px-4 text-gray-800 text-xs sm:text-sm"
                          aria-label="Date"
                        >
                          {att.date ? formatIndianDate(att.date) : "-"}
                        </td>
                        <td
                          className="whitespace-normal break-words py-2 sm:py-3 px-2 sm:px-4 text-gray-800 text-xs sm:text-sm"
                          aria-label="Status"
                        >
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold
                                ${
                                  att.status === "Present"
                                    ? "bg-green-100 text-green-700"
                                    : att.status === "Absent"
                                    ? "bg-red-100 text-red-700"
                                    : att.status === "Late"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-gray-100 text-gray-600"
                                }
                              `}
                          >
                            {att.status === "Present" && (
                              <FaCheckCircle
                                className="text-green-500"
                                aria-label="Present"
                              />
                            )}
                            {att.status === "Absent" && (
                              <FaTimesCircle
                                className="text-red-500"
                                aria-label="Absent"
                              />
                            )}
                            {att.status === "Late" && (
                              <FaClock
                                className="text-yellow-500"
                                aria-label="Late"
                              />
                            )}
                            {!["Present", "Absent", "Late"].includes(
                              att.status
                            ) && (
                              <FaQuestionCircle
                                className="text-gray-400"
                                aria-label="Unknown"
                              />
                            )}
                            {att.status}
                          </span>
                        </td>
                        <td
                          className="whitespace-normal break-words py-2 sm:py-3 px-2 sm:px-4 text-gray-800 text-xs sm:text-sm"
                          aria-label="Note"
                        >
                          {att.note || "-"}
                        </td>
                        <td
                          className="whitespace-normal break-words py-2 sm:py-3 px-2 sm:px-4 text-gray-800 text-xs sm:text-sm"
                          aria-label="Recorded At"
                        >
                          {att.createdAt
                            ? formatIndianDateTime(att.createdAt)
                            : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex flex-wrap justify-center items-center gap-1 sm:gap-2 mt-4 sm:mt-6 select-none">
                    <button
                      className="px-2 py-1 rounded border text-gray-600 bg-gray-50 hover:bg-indigo-100 disabled:opacity-50 text-xs sm:text-sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      aria-label="Previous Page"
                    >
                      Prev
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          className={`px-2 sm:px-3 py-1 rounded border font-medium text-xs sm:text-sm transition-colors duration-150
                          ${
                            currentPage === page
                              ? "bg-indigo-500 text-white border-indigo-500"
                              : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-indigo-100"
                          }`}
                          onClick={() => handlePageChange(page)}
                          aria-label={`Page ${page}`}
                        >
                          {page}
                        </button>
                      )
                    )}
                    <button
                      className="px-2 py-1 rounded border text-gray-600 bg-gray-50 hover:bg-indigo-100 disabled:opacity-50 text-xs sm:text-sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      aria-label="Next Page"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
      {/* Animations */}
      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.7s cubic-bezier(0.4, 0, 0.2, 1) both;
        }
        .animate-slide-up {
          animation: slide-up 0.8s cubic-bezier(0.4, 0, 0.2, 1) both;
        }
        /* Responsive tweaks for attendance summary and table */
        @media (max-width: 640px) {
          .min-w-\[600px\],
          .min-w-full {
            min-width: 0 !important;
          }
          .max-w-2xl {
            max-width: 100vw !important;
          }
        }
      `}</style>
    </div>
  );
};

export default StudentAttendance;
