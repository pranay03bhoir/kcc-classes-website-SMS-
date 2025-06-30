"use client";
import { useTeacherAuth } from "@/hooks/useTeacherAuth";
import api, { getTeacherDetails } from "@/utils/teacher-axios";
import { useEffect, useMemo, useState } from "react";
import {
  FaArrowDown,
  FaArrowUp,
  FaBook,
  FaClipboardList,
  FaFilter,
  FaMedal,
  FaTrophy,
  FaUserGraduate,
} from "react-icons/fa";
import { MdOutlineGrade, MdOutlineScore } from "react-icons/md";
import Sidebar from "../../SideBar";
import AddScoreModal from "../modals/AddScoreModal";
import AddStudentScoreBulk from "../modals/AddStudentScoreBulk";

const EXAM_TYPES = [
  "Midterm",
  "Final",
  "Quiz",
  "Assignment",
  "Board",
  "JEE",
  "NEET",
  "JEE Mains",
  "JEE Advanced",
  "MH CET",
  "NEET UG",
  "NEET UA",
  "NEET PG",
];

const ITEMS_PER_PAGE = 10;

const calculateGrade = (score) => {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
};

const StudentScoreManagement = () => {
  const { user: teacher, isLoading: authLoading } = useTeacherAuth();
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [scores, setScores] = useState([]);
  const [filters, setFilters] = useState({
    subject: "All Subjects",
    examType: "All Types",
    sortByDate: "Newest First",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Fetch students, subjects, and scores
  useEffect(() => {
    const fetchData = async () => {
      setError("");
      try {
        const res = await getTeacherDetails();
        const allSubjects = res.data.teacher.subjects;
        const batches = res.data.teacher.batches || [];
        const allStudents = batches.flatMap((batch) => batch.studentIds || []);
        setStudents(allStudents);
        setSubjects(allSubjects);
        // Gather all scores from all students, use allSubjects directly
        const allScores = allStudents.flatMap((student) =>
          (student.scores || []).map((score) => ({
            ...score,
            studentId: student._id,
            studentIdDisplay: student.studentId,
            studentName: student.name,
            subject: allSubjects.find((s) => s._id === score.subject) || {},
            date: score.date,
          }))
        );
        setScores(allScores);
      } catch (err) {
        setError(
          err?.response?.data?.message || "Failed to fetch teacher details."
        );
      }
    };
    fetchData();
  }, []);

  // Filtered and sorted and paginated scores
  const filteredScores = useMemo(() => {
    let result = scores.filter((score) => {
      if (
        filters.subject !== "All Subjects" &&
        score.subject?.name !== filters.subject
      )
        return false;
      if (
        filters.examType !== "All Types" &&
        score.examType !== filters.examType
      )
        return false;
      return true;
    });
    // Sort by date
    result = result.sort((a, b) => {
      const dateA = new Date(a.date || 0);
      const dateB = new Date(b.date || 0);
      if (filters.sortByDate === "Newest First") {
        return dateB - dateA;
      } else {
        return dateA - dateB;
      }
    });
    return result;
  }, [scores, filters]);

  const paginatedScores = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredScores.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredScores, currentPage]);

  const totalPages = Math.ceil(filteredScores.length / ITEMS_PER_PAGE);

  // Stats
  const stats = useMemo(() => {
    if (!filteredScores.length) {
      return {
        averageScore: 0,
        highestScore: 0,
        totalStudents: students.length,
        belowAverage: 0,
      };
    }
    const scoreValues = filteredScores.map((s) => s.score);
    const average = scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length;
    const highest = Math.max(...scoreValues);
    const belowAvg = scoreValues.filter((s) => s < average).length;
    return {
      averageScore: average.toFixed(1),
      highestScore: highest,
      totalStudents: students.length,
      belowAverage: belowAvg,
    };
  }, [filteredScores, students.length]);

  // Top 5 Scorers calculation
  const topScorers = useMemo(() => {
    if (!students.length) return [];
    // Map studentId to { name, studentIdDisplay, avgScore, count }
    const studentScores = [];
    students.forEach((student) => {
      if (!student.scores || !student.scores.length) return;
      const total = student.scores.reduce((sum, s) => sum + s.score, 0);
      const avg = total / student.scores.length;
      studentScores.push({
        name: student.name,
        studentIdDisplay: student.studentId,
        avgScore: avg,
        count: student.scores.length,
      });
    });
    if (!studentScores.length) return [];
    // Sort by avgScore descending, then by name for tie-breaker
    studentScores.sort(
      (a, b) => b.avgScore - a.avgScore || a.name.localeCompare(b.name)
    );
    return studentScores.slice(0, 5);
  }, [students]);

  // Add Score handler for modal
  const handleAddScore = async (payload) => {
    setError("");
    setSuccess("");
    try {
      const res = await api.post("/students/scores", payload);
      setSuccess(res.data.message || "Score added successfully.");
      setShowForm(false);
      // Refresh scores
      const res2 = await getTeacherDetails();
      const batches = res2.data.teacher.batches || [];
      const allStudents = batches.flatMap((batch) => batch.studentIds || []);
      setStudents(allStudents);
      const allSubjects = res2.data.teacher.subjects;
      setSubjects(allSubjects);
      const allScores = allStudents.flatMap((student) =>
        (student.scores || []).map((score) => ({
          ...score,
          studentId: student._id,
          studentIdDisplay: student.studentId,
          studentName: student.name,
          subject: allSubjects.find((s) => s._id === score.subject) || {},
          date: score.date,
        }))
      );
      setScores(allScores);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to add score.");
    }
  };

  // Filter change
  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Sidebar for desktop and mobile handled by Sidebar component */}
      <div className="fixed inset-y-0 left-0 z-40 md:relative md:z-auto">
        <Sidebar teacher={teacher} />
      </div>
      {/* Main Content */}
      <div className="flex-1 md:ml-16 p-2 sm:p-4 md:p-8">
        <div className="flex flex-col sm:flex-row flex-wrap justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Student Grades
            </h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              Manage and monitor student performance
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <button
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              onClick={() => setShowForm(true)}
            >
              + Add Score
            </button>
            <button
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              onClick={() => setShowBulkModal(true)}
            >
              Bulk Add
            </button>
          </div>
        </div>
        {/* Success/Error Banners */}
        {success && (
          <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded text-sm sm:text-base">
            {success}
          </div>
        )}
        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm sm:text-base">
            {error}
          </div>
        )}
        {/* Add Score Modal */}
        <AddScoreModal
          isOpen={showForm}
          onClose={() => setShowForm(false)}
          students={students}
          subjects={subjects}
          onSubmit={handleAddScore}
        />
        <AddStudentScoreBulk
          isOpen={showBulkModal}
          onClose={() => setShowBulkModal(false)}
          students={students}
          subjects={subjects}
          onSuccess={async () => {
            setSuccess("Scores added successfully.");
            // Refresh scores
            try {
              const res2 = await getTeacherDetails();
              const batches = res2.data.teacher.batches || [];
              const allStudents = batches.flatMap(
                (batch) => batch.studentIds || []
              );
              setStudents(allStudents);
              const allSubjects = res2.data.teacher.subjects;
              setSubjects(allSubjects);
              const allScores = allStudents.flatMap((student) =>
                (student.scores || []).map((score) => ({
                  ...score,
                  studentId: student._id,
                  studentIdDisplay: student.studentId,
                  studentName: student.name,
                  subject:
                    allSubjects.find((s) => s._id === score.subject) || {},
                  date: score.date,
                }))
              );
              setScores(allScores);
            } catch (err) {
              setError(
                err?.response?.data?.message || "Failed to refresh scores."
              );
            }
          }}
        />
        {/* Top 5 Scorers Section (moved above table, enhanced UI) */}
        {topScorers.length > 0 && (
          <div className="mb-8">
            <div className="bg-gradient-to-r from-yellow-50 via-white to-yellow-100 border border-yellow-200 rounded-2xl p-4 sm:p-7 shadow-lg">
              <h2 className="text-xl sm:text-2xl font-extrabold text-yellow-800 mb-4 sm:mb-6 flex items-center gap-3">
                <FaTrophy className="text-yellow-500 text-2xl sm:text-3xl" />{" "}
                Top 5 Scorers
              </h2>
              <div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-6 justify-start">
                {topScorers.map((scorer, idx) => {
                  let icon = null;
                  let bg = "bg-gray-100";
                  let border = "border-gray-200";
                  let text = "text-gray-800";
                  if (idx === 0) {
                    icon = (
                      <FaTrophy
                        className="text-yellow-500 text-xl"
                        title="Top Scorer"
                      />
                    );
                    bg = "bg-yellow-100";
                    border = "border-yellow-400";
                    text = "text-yellow-900";
                  } else if (idx === 1) {
                    icon = (
                      <FaMedal
                        className="text-gray-400 text-xl"
                        title="2nd Place"
                      />
                    );
                    bg = "bg-gray-100";
                    border = "border-gray-300";
                    text = "text-gray-700";
                  } else if (idx === 2) {
                    icon = (
                      <FaMedal
                        className="text-orange-700 text-xl"
                        title="3rd Place"
                      />
                    );
                    bg = "bg-orange-100";
                    border = "border-orange-300";
                    text = "text-orange-900";
                  }
                  return (
                    <div
                      key={scorer.studentIdDisplay}
                      className={`flex items-center gap-4 px-6 py-4 rounded-xl shadow border ${bg} ${border} min-w-[220px]`}
                    >
                      {/* Avatar with initials */}
                      <div className="w-12 h-12 rounded-full bg-white border-2 border-yellow-200 flex items-center justify-center text-2xl font-bold text-yellow-600 shadow-sm">
                        {scorer.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div className="flex-1">
                        <div
                          className={`flex items-center gap-2 font-semibold text-lg ${text}`}
                        >
                          {icon}
                          <span>
                            {idx + 1}. {scorer.name}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 font-mono">
                          {scorer.studentIdDisplay}
                        </div>
                        <div className="text-sm mt-1 text-yellow-700 font-bold">
                          Avg. Score: {scorer.avgScore.toFixed(1)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-md p-4 sm:p-8 mb-8 sm:mb-10 border border-gray-100">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2">
            <FaFilter className="text-blue-500" /> Filter Results
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="relative">
              <label className=" text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                <FaBook className="text-blue-400" /> Subject
              </label>
              <select
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white hover:border-gray-300 shadow-sm"
                value={filters.subject}
                onChange={(e) => handleFilterChange("subject", e.target.value)}
              >
                <option value="All Subjects">All Subjects</option>
                {subjects.map((subject) => (
                  <option key={subject._id} value={subject.name}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="relative">
              <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                <FaClipboardList className="text-green-400" /> Exam Type
              </label>
              <select
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white hover:border-gray-300 shadow-sm"
                value={filters.examType}
                onChange={(e) => handleFilterChange("examType", e.target.value)}
              >
                <option value="All Types">All Types</option>
                {EXAM_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            {/* Sort by Date Filter */}
            <div className="relative">
              <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                <FaArrowDown className="text-blue-400" /> Sort by Date
              </label>
              <select
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white hover:border-gray-300 shadow-sm"
                value={filters.sortByDate}
                onChange={(e) =>
                  handleFilterChange("sortByDate", e.target.value)
                }
              >
                <option value="Newest First">Newest First</option>
                <option value="Oldest First">Oldest First</option>
              </select>
            </div>
          </div>
        </div>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 mb-8 sm:mb-10">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-7 shadow-md border border-blue-100 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">
                  Average Score
                </p>
                <p className="text-3xl font-bold text-blue-900 mt-2 flex items-center gap-2">
                  {stats.averageScore}{" "}
                  <MdOutlineScore className="text-blue-400" />
                </p>
              </div>
              <div className="bg-blue-200 p-3 rounded-full">
                <FaArrowUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-7 shadow-md border border-green-100 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">
                  Highest Score
                </p>
                <p className="text-3xl font-bold text-green-900 mt-2 flex items-center gap-2">
                  {stats.highestScore} <FaArrowUp className="text-green-400" />
                </p>
              </div>
              <div className="bg-green-200 p-3 rounded-full">
                <MdOutlineScore className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-7 shadow-md border border-purple-100 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">
                  Total Students
                </p>
                <p className="text-3xl font-bold text-purple-900 mt-2 flex items-center gap-2">
                  {stats.totalStudents}{" "}
                  <FaUserGraduate className="text-purple-400" />
                </p>
              </div>
              <div className="bg-purple-200 p-3 rounded-full">
                <FaUserGraduate className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-7 shadow-md border border-yellow-100 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">
                  Below Average
                </p>
                <p className="text-3xl font-bold text-yellow-700 mt-2 flex items-center gap-2">
                  {stats.belowAverage}{" "}
                  <FaArrowDown className="text-yellow-400" />
                </p>
              </div>
              <div className="bg-yellow-200 p-3 rounded-full">
                <FaArrowDown className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>
        {/* Scores Table */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-x-auto">
          <table className="min-w-full text-sm sm:text-base">
            <thead className="sticky top-0 z-10 bg-gray-50">
              <tr className="text-left">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Student ID
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Student Name
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Exam Type
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Grade
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedScores.length > 0 ? (
                paginatedScores.map((score, idx) => (
                  <tr
                    key={score._id || idx}
                    className={`transition-colors duration-200 ${
                      idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-blue-50`}
                  >
                    <td className="px-6 py-4">{score.studentIdDisplay}</td>
                    <td className="px-6 py-4">{score.studentName}</td>
                    <td className="px-6 py-4">
                      {score.subject?.name || "N/A"}
                    </td>
                    <td className="px-6 py-4">{score.examType}</td>
                    <td className="px-6 py-4">{score.score}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold gap-1 ${
                          calculateGrade(score.score) === "A"
                            ? "bg-green-100 text-green-800"
                            : calculateGrade(score.score) === "B"
                            ? "bg-blue-100 text-blue-800"
                            : calculateGrade(score.score) === "C"
                            ? "bg-yellow-100 text-yellow-800"
                            : calculateGrade(score.score) === "D"
                            ? "bg-orange-100 text-orange-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        <MdOutlineGrade />
                        {calculateGrade(score.score)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {score.date
                        ? new Date(score.date).toLocaleDateString()
                        : "N/A"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No scores found. Add some scores to see them here.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-wrap justify-end gap-2 mt-6 sm:mt-8">
            <button
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors duration-200 shadow-sm border border-gray-200 ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-blue-50"
              }`}
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              First
            </button>
            <button
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors duration-200 shadow-sm border border-gray-200 ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-blue-50"
              }`}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            {/* Numbered Pagination with Ellipsis */}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (pageNum) =>
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  Math.abs(pageNum - currentPage) <= 1
              )
              .map((pageNum, idx, arr) => {
                if (idx > 0 && pageNum - arr[idx - 1] > 1) {
                  return [
                    <span key={`ellipsis-${pageNum}`} className="px-2">
                      ...
                    </span>,
                    <button
                      key={pageNum}
                      className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors duration-200 shadow-sm border border-gray-200 ${
                        currentPage === pageNum
                          ? "bg-blue-600 text-white"
                          : "bg-white text-gray-700 hover:bg-blue-50"
                      }`}
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </button>,
                  ];
                }
                return (
                  <button
                    key={pageNum}
                    className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors duration-200 shadow-sm border border-gray-200 ${
                      currentPage === pageNum
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-700 hover:bg-blue-50"
                    }`}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}
            <button
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors duration-200 shadow-sm border border-gray-200 ${
                currentPage === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-blue-50"
              }`}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
            <button
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors duration-200 shadow-sm border border-gray-200 ${
                currentPage === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-blue-50"
              }`}
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              Last
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentScoreManagement;
