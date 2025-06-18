"use client";

import api from "@/utils/axios";
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { useEffect, useMemo, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  FaDownload,
  FaFilter,
  FaPlus,
  FaSpinner,
  FaUpload,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./SideBar";
import AddScoreModal from "./components/modals/AddScoresModal";
import AddStudentsScoreBulk from "./components/modals/AddStudentsScoreBulk";
import DeleteScoreModal from "./components/modals/DeleteScoreModal";
import EditScoreModal from "./components/modals/EditScoreModal";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ITEMS_PER_PAGE = 10;

// Helper function to calculate grade based on score
const calculateGrade = (score) => {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
};

const AdminStudentScoreManagement = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [addScoreModalOpen, setAddScoreModalOpen] = useState(false);
  const [bulkAddModalOpen, setBulkAddModalOpen] = useState(false);
  const [editScoreModalOpen, setEditScoreModalOpen] = useState(false);
  const [deleteScoreModalOpen, setDeleteScoreModalOpen] = useState(false);
  const [selectedScore, setSelectedScore] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [students, setStudents] = useState([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [filters, setFilters] = useState({
    subject: "All Subjects",
    examType: "All Types",
    gradeRange: "All Grades",
  });
  const [stats, setStats] = useState({
    averageScore: 0,
    highestScore: 0,
    totalStudents: 0,
    belowAverage: 0,
  });

  // Add exam types constant to match backend model
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

  // API call to fetch students with scores
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Fetch all students without pagination to get all scores
        const response = await api.get(`/students`);

        if (response.data.success) {
          setStudents(response.data.students);
          setTotalStudents(response.data.students.length);
          // Flatten scores from all students for processing
          const allScores = response.data.students.flatMap((student) =>
            student.scores
              ? student.scores.map((score) => ({
                  ...score,
                  studentId: student._id,
                  studentName: student.name,
                  id: student._id,
                }))
              : []
          );
          calculateStats(allScores);
          setError(null);
        } else {
          setError("Failed to fetch students. Please try again later.");
        }
      } catch (err) {
        console.error("Error fetching students:", err);
        setError("Failed to fetch students. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Clear success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const addScoreToStudents = async (scoreData) => {
    try {
      const response = await api.post("/scores/students", scoreData);
      if (response.data.success) {
        setAddScoreModalOpen(false);
        setError(null);
        setSuccessMessage("Score added successfully!");
        // Re-fetch students to update scores
        const updatedResponse = await api.get(`/students`);
        if (updatedResponse.data.success) {
          setStudents(updatedResponse.data.students);
          setTotalStudents(updatedResponse.data.students.length);
          calculateStats(
            updatedResponse.data.students.flatMap((student) =>
              student.scores
                ? student.scores.map((score) => ({
                    ...score,
                    studentId: student._id,
                    studentName: student.name,
                    id: student._id,
                  }))
                : []
            )
          );
        }
      } else {
        setError(
          response.data.message || "Failed to add score. Please try again."
        );
      }
    } catch (error) {
      console.error("Error adding score:", error);
      if (error.response) {
        // Handle specific error responses from the server
        const errorMessage =
          error.response.data?.message ||
          "Failed to add score. Please try again later.";
        setError(errorMessage);
      } else if (error.request) {
        // Network error
        setError("Network error. Please check your connection and try again.");
      } else {
        // Other errors
        setError("Failed to add score. Please try again later.");
      }
    }
  };

  const updateScore = async (updatedScoreData) => {
    try {
      setError(null);
      toast.success("Score updated successfully!");

      // Re-fetch students to update scores
      const updatedResponse = await api.get(`/students`);
      if (updatedResponse.data.success) {
        setStudents(updatedResponse.data.students);
        setTotalStudents(updatedResponse.data.students.length);
        calculateStats(
          updatedResponse.data.students.flatMap((student) =>
            student.scores
              ? student.scores.map((score) => ({
                  ...score,
                  studentId: student._id,
                  studentName: student.name,
                  id: student._id,
                }))
              : []
          )
        );
      }
    } catch (error) {
      console.error("Error updating score:", error);
      setError("Failed to refresh data after update. Please refresh the page.");
    }
  };

  const handleDeleteScore = async () => {
    try {
      setError(null);
      setSuccessMessage("Score deleted successfully!");

      // Re-fetch students to update scores
      const updatedResponse = await api.get(`/students`);
      if (updatedResponse.data.success) {
        setStudents(updatedResponse.data.students);
        setTotalStudents(updatedResponse.data.students.length);
        calculateStats(
          updatedResponse.data.students.flatMap((student) =>
            student.scores
              ? student.scores.map((score) => ({
                  ...score,
                  studentId: student._id,
                  studentName: student.name,
                  id: student._id,
                }))
              : []
          )
        );
      }
    } catch (error) {
      console.error("Error refreshing data after delete:", error);
      setError("Failed to refresh data after delete. Please refresh the page.");
    }
  };

  const calculateStats = (scores) => {
    if (!scores || scores.length === 0) {
      setStats({
        averageScore: 0,
        highestScore: 0,
        totalStudents: totalStudents,
        belowAverage: 0,
      });
      return;
    }

    const scoreValues = scores.map((score) => score.score);
    const average = scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length;
    const highest = Math.max(...scoreValues);
    const belowAvg = scoreValues.filter((s) => s < average).length;

    setStats({
      averageScore: average.toFixed(1),
      highestScore: highest,
      totalStudents: students.length,
      belowAverage: belowAvg,
    });
  };

  // Flatten all scores from students for filtering and display
  const allScores = useMemo(() => {
    return students.flatMap((student) =>
      student.scores
        ? student.scores.map((score, scoreIndex) => ({
            ...score,
            studentId: student._id,
            studentIdDisplay: student.studentId,
            studentName: student.name,
            id: student._id,
            uniqueId: `${student._id}-${score._id || scoreIndex}-${
              score.examType
            }-${score.date}`,
          }))
        : []
    );
  }, [students]);

  const filteredScores = useMemo(() => {
    return allScores.filter((score) => {
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
      if (filters.gradeRange !== "All Grades") {
        const [min, max] = filters.gradeRange.split("-");
        if (score.score < parseInt(min) || score.score > parseInt(max))
          return false;
      }
      return true;
    });
  }, [allScores, filters]);

  // Implement client-side pagination for filtered scores
  const paginatedScores = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredScores.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredScores, currentPage]);

  // Calculate total pages based on filtered scores
  const totalPages = Math.ceil(filteredScores.length / ITEMS_PER_PAGE);

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
    setCurrentPage(1); // Reset to first page when filters change
    setError(null);
    setSuccessMessage(null);
  };

  const handleExport = () => {
    const csvContent = [
      [
        "Student ID",
        "Student Name",
        "Subject",
        "Exam Type",
        "Score",
        "Grade",
        "Date",
      ],
      ...filteredScores.map((score) => [
        score.studentIdDisplay,
        score.studentName,
        score.subject?.name || "N/A",
        score.examType,
        score.score,
        calculateGrade(score.score),
        new Date(score.date).toLocaleDateString(),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `scores-export-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const gradeDistributionData = {
    labels: ["A (90-100)", "B (80-89)", "C (70-79)", "D (60-69)", "F (0-59)"],
    datasets: [
      {
        label: "Number of Students",
        data: [
          filteredScores.filter((score) => score.score >= 90).length,
          filteredScores.filter(
            (score) => score.score >= 80 && score.score < 90
          ).length,
          filteredScores.filter(
            (score) => score.score >= 70 && score.score < 80
          ).length,
          filteredScores.filter(
            (score) => score.score >= 60 && score.score < 70
          ).length,
          filteredScores.filter((score) => score.score < 60).length,
        ],
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  // Calculate top performers based on average scores
  const getTopPerformers = useMemo(() => {
    const studentScores = {};

    // Group scores by student
    allScores.forEach((score) => {
      if (!studentScores[score.studentIdDisplay]) {
        studentScores[score.studentIdDisplay] = {
          id: score.studentIdDisplay,
          name: score.studentName,
          scores: [],
          averageScore: 0,
          bestSubject: "",
          bestScore: 0,
        };
      }
      studentScores[score.studentIdDisplay].scores.push({
        subject: score.subject?.name || "N/A",
        score: score.score,
      });
    });

    return Object.values(studentScores)
      .map((student) => {
        const scores = student.scores;
        const averageScore =
          scores.reduce((sum, s) => sum + s.score, 0) / scores.length;
        const bestScore = Math.max(...scores.map((s) => s.score));
        const bestSubject = scores.find((s) => s.score === bestScore)?.subject;

        return {
          ...student,
          averageScore: averageScore.toFixed(1),
          bestScore,
          bestSubject,
        };
      })
      .sort((a, b) => b.averageScore - a.averageScore)
      .slice(0, 5);
  }, [allScores]);

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <ToastContainer position="top-center" />

      {/* Sidebar - Fixed on desktop, overlay on mobile */}
      <div className="fixed inset-y-0 left-0 z-40 md:relative md:z-auto">
        <Sidebar />
      </div>

      {/* Main content area - Properly positioned for mobile and desktop */}
      <div className="flex-1 w-full md:ml-16 p-8">
        <div className="flex flex-wrap justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Student Grades</h1>
            <p className="text-gray-600 mt-1">
              Manage and monitor student performance
            </p>
          </div>
          <button
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            onClick={() => {
              setError(null);
              setSuccessMessage(null);
              setAddScoreModalOpen(true);
            }}
          >
            <FaPlus className="text-lg" /> Add Grade
          </button>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {successMessage}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Filter Results
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <select
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white hover:border-gray-300"
                value={filters.subject}
                onChange={(e) => handleFilterChange("subject", e.target.value)}
              >
                <option value="All Subjects">All Subjects</option>
                {Array.from(
                  new Set(
                    allScores
                      .map((score) => score.subject?.name)
                      .filter(Boolean)
                  )
                ).map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Exam Type
              </label>
              <select
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white hover:border-gray-300"
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
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Grade Range
              </label>
              <select
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white hover:border-gray-300"
                value={filters.gradeRange}
                onChange={(e) =>
                  handleFilterChange("gradeRange", e.target.value)
                }
              >
                <option value="All Grades">All Grades</option>
                <option value="90-100">90-100</option>
                <option value="80-89">80-89</option>
                <option value="70-79">70-79</option>
                <option value="60-69">60-69</option>
                <option value="0-59">Below 60</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg px-4 py-2.5 flex items-center justify-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md"
                onClick={() => {
                  /* Reset filters */
                }}
              >
                <FaFilter /> Apply Filters
              </button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <FaSpinner className="animate-spin text-5xl text-green-500" />
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 transform hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Average Score
                    </p>
                    <p className="text-3xl font-bold text-gray-800 mt-2">
                      {stats.averageScore}
                    </p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <svg
                      className="w-6 h-6 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 transform hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Highest Score
                    </p>
                    <p className="text-3xl font-bold text-gray-800 mt-2">
                      {stats.highestScore}
                    </p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 transform hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Students
                    </p>
                    <p className="text-3xl font-bold text-gray-800 mt-2">
                      {stats.totalStudents}
                    </p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-full">
                    <svg
                      className="w-6 h-6 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 transform hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Below Average
                    </p>
                    <p className="text-3xl font-bold text-yellow-600 mt-2">
                      {stats.belowAverage}
                    </p>
                  </div>
                  <div className="bg-yellow-100 p-3 rounded-full">
                    <svg
                      className="w-6 h-6 text-yellow-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Leaderboard Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Top Performers
                  </h2>
                  <span className="text-sm text-gray-500">
                    Based on average scores
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {getTopPerformers.map((student, index) => (
                    <div
                      key={student.id}
                      className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                    >
                      <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                        {index === 0 ? (
                          <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-white font-bold">
                            1
                          </div>
                        ) : index === 1 ? (
                          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold">
                            2
                          </div>
                        ) : index === 2 ? (
                          <div className="w-10 h-10 bg-amber-600 rounded-full flex items-center justify-center text-white font-bold">
                            3
                          </div>
                        ) : (
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold">
                            {index + 1}
                          </div>
                        )}
                      </div>
                      <div className="ml-4 flex-grow">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">
                              {student.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              ID: {student.id}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-semibold text-gray-900">
                              {student.averageScore}%
                            </div>
                            <div className="text-sm text-gray-500">
                              Best: {student.bestScore}% in{" "}
                              {student.bestSubject}
                            </div>
                          </div>
                        </div>
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${student.averageScore}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Grade Distribution Chart */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  Grade Distribution
                </h2>
                <div className="text-sm text-gray-500">Last 30 days</div>
              </div>
              <div className="h-64">
                <Line
                  data={gradeDistributionData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "top",
                        labels: {
                          usePointStyle: true,
                          padding: 20,
                          font: {
                            size: 12,
                          },
                        },
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          stepSize: 1,
                          font: {
                            size: 12,
                          },
                        },
                        grid: {
                          color: "rgba(0, 0, 0, 0.05)",
                        },
                      },
                      x: {
                        grid: {
                          display: false,
                        },
                        ticks: {
                          font: {
                            size: 12,
                          },
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>

            {/* Recent Grades Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Recent Grades
                  </h2>
                  <div className="flex gap-3">
                    <button
                      className="border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200 flex items-center gap-2"
                      onClick={handleExport}
                    >
                      <FaDownload className="text-gray-500" /> Export
                    </button>
                    <button
                      className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md"
                      onClick={() => {
                        setBulkAddModalOpen(true);
                      }}
                    >
                      <FaUpload /> Bulk Add
                    </button>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 text-left">
                      <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student ID
                      </th>
                      <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student Name
                      </th>
                      <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subject
                      </th>
                      <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Exam Type
                      </th>
                      <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Score
                      </th>
                      <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Grade
                      </th>
                      <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paginatedScores.length > 0 ? (
                      paginatedScores.map((score, idx) => (
                        <tr
                          key={score.uniqueId}
                          className="hover:bg-gray-50 transition-colors duration-200"
                        >
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-gray-900">
                                {score.studentIdDisplay}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {score.studentName}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {score.subject?.name || "N/A"}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {score.examType}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {score.score}%
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
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
                              {calculateGrade(score.score)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {new Date(score.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <div className="flex gap-3">
                              <button
                                className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                                onClick={() => {
                                  setEditScoreModalOpen(true);
                                  setSelectedScore(score);
                                }}
                              >
                                Edit
                              </button>
                              <button
                                className="text-red-600 hover:text-red-800 transition-colors duration-200"
                                onClick={() => {
                                  setDeleteScoreModalOpen(true);
                                  setSelectedScore(score);
                                }}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="8"
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
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                  <div className="flex justify-end gap-2">
                    <button
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                        currentPage === 1
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                      }`}
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                    >
                      First
                    </button>
                    <button
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                        currentPage === 1
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                      }`}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <button
                          key={pageNum}
                          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                            currentPage === pageNum
                              ? "bg-green-500 text-white"
                              : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                          }`}
                          onClick={() => setCurrentPage(pageNum)}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    <button
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                        currentPage === totalPages
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                      }`}
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                    <button
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                        currentPage === totalPages
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                      }`}
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                    >
                      Last
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
      <AddScoreModal
        isOpen={addScoreModalOpen}
        onClose={() => setAddScoreModalOpen(false)}
        onSubmit={addScoreToStudents}
        students={students}
        subjects={Array.from(
          students
            .flatMap((student) =>
              student.subjects
                ? student.subjects.map((subject) => ({
                    _id: subject._id,
                    name: subject.name,
                  }))
                : []
            )
            .reduce((map, subject) => {
              map.set(subject._id, subject);
              return map;
            }, new Map())
            .values()
        )}
      />
      <AddStudentsScoreBulk
        isOpen={bulkAddModalOpen}
        onClose={() => setBulkAddModalOpen(false)}
        students={students}
        subjects={Array.from(
          students
            .flatMap((student) =>
              student.subjects
                ? student.subjects.map((subject) => ({
                    _id: subject._id,
                    name: subject.name,
                  }))
                : []
            )
            .reduce((map, subject) => {
              map.set(subject._id, subject);
              return map;
            }, new Map())
            .values()
        )}
      />
      <EditScoreModal
        isOpen={editScoreModalOpen}
        onClose={() => setEditScoreModalOpen(false)}
        onUpdate={updateScore}
        scoreData={selectedScore}
        students={students}
        subjects={Array.from(
          students
            .flatMap((student) =>
              student.subjects
                ? student.subjects.map((subject) => ({
                    _id: subject._id,
                    name: subject.name,
                  }))
                : []
            )
            .reduce((map, subject) => {
              map.set(subject._id, subject);
              return map;
            }, new Map())
            .values()
        )}
      />
      <DeleteScoreModal
        isOpen={deleteScoreModalOpen}
        onClose={() => setDeleteScoreModalOpen(false)}
        onDelete={handleDeleteScore}
        scoreData={selectedScore}
      />
    </div>
  );
};

export default AdminStudentScoreManagement;
