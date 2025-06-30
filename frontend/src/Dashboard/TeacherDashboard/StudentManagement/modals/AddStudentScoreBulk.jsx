"use client";
import { Dialog } from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import api from "../../../../utils/axios";

const examTypes = [
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

export default function AddStudentsScoreBulk({
  isOpen,
  onClose,
  students = [],
  subjects = [],
  onSuccess,
}) {
  const [subjectId, setSubjectId] = useState("");
  const [examType, setExamType] = useState("Midterm");
  const [date, setDate] = useState("");
  const [scores, setScores] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setSubjectId("");
      setExamType("Midterm");
      setDate("");
      setScores({});
      setError("");
    }
  }, [isOpen]);

  const handleScoreChange = (id, value) => {
    // Validate score is between 0 and 100
    const numValue = parseInt(value);
    if (numValue < 0 || numValue > 100) {
      return;
    }
    setScores({ ...scores, [id]: numValue });
  };

  const handleSave = async () => {
    if (!subjectId) {
      setError("Please select a subject");
      return;
    }

    if (!date) {
      setError("Please select a date");
      return;
    }

    const studentsWithScores = students.filter(
      (student) =>
        scores[student._id] !== undefined && scores[student._id] !== ""
    );

    if (studentsWithScores.length === 0) {
      setError("Please enter scores for at least one student");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Create an array of promises for all score submissions
      const scorePromises = studentsWithScores.map((student) =>
        api.post("/scores/students", {
          studentId: student._id,
          subject: subjectId,
          examType,
          score: scores[student._id],
          date: new Date(date),
        })
      );

      // Wait for all score submissions to complete
      await Promise.all(scorePromises);

      console.log("All scores saved successfully");
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error("Error saving scores:", err);
      setError(
        err.response?.data?.message ||
          "Failed to save scores. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gradient-to-br from-green-100/60 to-blue-200/60 backdrop-blur-sm"
            aria-hidden="true"
          />
          <div className="fixed inset-0 flex items-center justify-center p-2 sm:p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-3xl md:max-w-2xl sm:max-w-lg xs:max-w-xs rounded-2xl bg-white shadow-2xl p-0 overflow-hidden mx-2 sm:mx-0"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 sm:px-8 py-4 sm:py-5 bg-gradient-to-r from-green-500 to-blue-500 text-white">
                <Dialog.Title className="text-lg sm:text-2xl font-bold tracking-tight flex items-center gap-2">
                  <span className="inline-block bg-white/20 rounded-full p-2">
                    <svg
                      width="24"
                      height="24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-users"
                    >
                      <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </span>
                  Bulk Add Grades
                </Dialog.Title>
                <button
                  onClick={onClose}
                  className="hover:bg-white/20 rounded-full p-2 transition-colors"
                >
                  <IoClose className="w-6 h-6 sm:w-7 sm:h-7" />
                </button>
              </div>

              <div className="px-4 sm:px-8 py-4 sm:py-6">
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded flex items-center gap-2 shadow-sm animate-pulse text-sm sm:text-base">
                    <svg
                      className="w-5 h-5 text-red-500"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>{error}</span>
                  </div>
                )}

                {/* Form */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold mb-1 sm:mb-2 text-gray-700">
                      Subject
                    </label>
                    <select
                      value={subjectId}
                      onChange={(e) => setSubjectId(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-2 sm:px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition outline-none bg-gray-50 hover:bg-gray-100 text-xs sm:text-base"
                    >
                      <option value="">Select Subject</option>
                      {subjects.map((subject) => (
                        <option key={subject._id} value={subject._id}>
                          {subject.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold mb-1 sm:mb-2 text-gray-700">
                      Exam Type
                    </label>
                    <select
                      value={examType}
                      onChange={(e) => setExamType(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-2 sm:px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition outline-none bg-gray-50 hover:bg-gray-100 text-xs sm:text-base"
                    >
                      {examTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold mb-1 sm:mb-2 text-gray-700">
                      Date
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-2 sm:px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition outline-none bg-gray-50 hover:bg-gray-100 text-xs sm:text-base"
                    />
                  </div>
                </div>

                {/* Student Scores */}
                <div className="bg-gradient-to-br from-blue-50 to-green-50 p-3 sm:p-6 rounded-xl shadow-inner">
                  <h3 className="font-semibold mb-3 sm:mb-5 text-base sm:text-lg text-blue-700 flex items-center gap-2">
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"
                      />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    Students in{" "}
                    {subjects.find((s) => s._id === subjectId)?.name ||
                      "Selected Subject"}
                  </h3>
                  {students.length === 0 ? (
                    <p className="text-gray-500 text-center py-4 text-sm">
                      No students available
                    </p>
                  ) : (
                    <div className="space-y-2 sm:space-y-3 max-h-48 sm:max-h-72 overflow-y-auto pr-1 sm:pr-2 custom-scrollbar">
                      {students.map((student) => {
                        // Avatar/Initials
                        const initials = student.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase();
                        return (
                          <div
                            key={student._id}
                            className="flex items-center justify-between bg-white px-3 sm:px-5 py-2 sm:py-3 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition mb-1"
                          >
                            <div className="flex items-center gap-2 sm:gap-4">
                              <span className="inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-400 to-green-400 text-white font-bold text-base sm:text-lg shadow">
                                {initials}
                              </span>
                              <div>
                                <p className="font-medium text-gray-800 text-xs sm:text-base">
                                  {student.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {student.studentId}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 sm:gap-2">
                              <input
                                type="number"
                                placeholder="Score (0-100)"
                                min="0"
                                max="100"
                                value={scores[student._id] || ""}
                                onChange={(e) =>
                                  handleScoreChange(student._id, e.target.value)
                                }
                                className="w-16 sm:w-24 border border-gray-300 rounded-lg px-2 py-1 text-right focus:ring-2 focus:ring-green-400 focus:border-green-400 transition outline-none bg-gray-50 hover:bg-gray-100 text-xs sm:text-base"
                              />
                              <span className="text-gray-400 text-xs sm:text-base">
                                / 100
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-6 sm:mt-8">
                  <button
                    onClick={onClose}
                    disabled={loading}
                    className="px-4 sm:px-5 py-2 rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-100 transition disabled:opacity-50 shadow-sm text-xs sm:text-base"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="px-4 sm:px-5 py-2 rounded-lg bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold shadow-md hover:from-green-600 hover:to-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-base"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>{" "}
                        Saving...
                      </span>
                    ) : (
                      <span>Save Grades</span>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
