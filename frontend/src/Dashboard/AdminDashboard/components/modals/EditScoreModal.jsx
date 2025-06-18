"use client";

import api from "@/utils/axios";
import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";

export default function EditScoreModal({
  isOpen,
  onClose,
  onUpdate,
  scoreData,
  students,
  subjects,
}) {
  const [formData, setFormData] = useState({
    score: "",
    date: "",
    examType: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Exam types constant to match backend model
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

  // Initialize form data when scoreData changes
  useEffect(() => {
    if (scoreData) {
      setFormData({
        score: scoreData.score?.toString() || "",
        date: scoreData.date
          ? new Date(scoreData.date).toISOString().split("T")[0]
          : "",
        examType: scoreData.examType,
      });
      setError("");
    }
  }, [scoreData]);

  const resetForm = () => {
    setFormData({
      score: "",
      date: "",
      examType: "",
    });
    setError("");
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.score) {
      setError("Please enter a score");
      return;
    }

    if (!formData.examType) {
      setError("Please select an exam type");
      return;
    }

    // Validate score range (0-100)
    const score = parseInt(formData.score);
    if (score < 0 || score > 100) {
      setError("Score must be between 0 and 100");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Always use the PUT endpoint to update the existing record
      const response = await api.put(
        `/scores/students/${scoreData.studentId}/${scoreData.subject._id}/${scoreData.examType}`,
        {
          score: score,
          date: formData.date ? new Date(formData.date) : undefined,
          newExamType:
            formData.examType !== scoreData.examType
              ? formData.examType
              : undefined,
        }
      );

      if (response.data.success) {
        onUpdate(response.data.updatedScore);
        resetForm();
        onClose(); // Close modal immediately
        toast.success("Score updated successfully!");
      } else {
        setError(response.data.message || "Failed to update score");
      }
    } catch (error) {
      console.error("Error updating score:", error);
      if (error.response) {
        setError(
          error.response.data?.message ||
            "Failed to update score. Please try again."
        );
      } else if (error.request) {
        setError("Network error. Please check your connection and try again.");
      } else {
        setError("Failed to update score. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen || !scoreData) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex justify-center items-center z-50 transition-all duration-200">
      <div className="bg-white w-full max-w-2xl rounded-xl p-8 shadow-sm relative transform transition-all duration-200">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <IoClose size={20} />
        </button>

        <h2 className="text-lg font-medium text-gray-800 mb-6">Edit Score</h2>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Student Information Display */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Student Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Student Name:</span>
              <span className="ml-2 font-medium text-gray-900">
                {scoreData.studentName}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Student ID:</span>
              <span className="ml-2 font-medium text-gray-900">
                {scoreData.studentIdDisplay || scoreData.studentId}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Subject:</span>
              <span className="ml-2 font-medium text-gray-900">
                {scoreData.subject?.name || "N/A"}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Current Exam Type:</span>
              <span className="ml-2 font-medium text-gray-900">
                {scoreData.examType}
              </span>
            </div>
          </div>
          <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
            💡 You can edit the score, date, and exam type below. All changes
            will update the existing score record.
          </div>
        </div>

        {/* Editable Fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="space-y-1">
            <label className="text-sm text-gray-600">Score (0-100) *</label>
            <input
              type="number"
              name="score"
              value={formData.score}
              onChange={handleChange}
              min="0"
              max="100"
              placeholder="Enter score (0-100)"
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 transition-all"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm text-gray-600">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm text-gray-600">Exam Type *</label>
            <select
              name="examType"
              value={formData.examType}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 transition-all"
              required
            >
              {EXAM_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Current Grade Display */}
        <div className="mt-6 bg-blue-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Grade Information
          </h3>
          <div className="flex items-center gap-4">
            <div>
              <span className="text-gray-600 text-sm">Current Score:</span>
              <span className="ml-2 font-medium text-gray-900">
                {scoreData.score}%
              </span>
            </div>
            <div>
              <span className="text-gray-600 text-sm">Current Grade:</span>
              <span
                className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  scoreData.score >= 90
                    ? "bg-green-100 text-green-800"
                    : scoreData.score >= 80
                    ? "bg-blue-100 text-blue-800"
                    : scoreData.score >= 70
                    ? "bg-yellow-100 text-yellow-800"
                    : scoreData.score >= 60
                    ? "bg-orange-100 text-orange-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {scoreData.score >= 90
                  ? "A"
                  : scoreData.score >= 80
                  ? "B"
                  : scoreData.score >= 70
                  ? "C"
                  : scoreData.score >= 60
                  ? "D"
                  : "F"}
              </span>
            </div>
            {formData.score && (
              <div>
                <span className="text-gray-600 text-sm">New Grade:</span>
                <span
                  className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    parseInt(formData.score) >= 90
                      ? "bg-green-100 text-green-800"
                      : parseInt(formData.score) >= 80
                      ? "bg-blue-100 text-blue-800"
                      : parseInt(formData.score) >= 70
                      ? "bg-yellow-100 text-yellow-800"
                      : parseInt(formData.score) >= 60
                      ? "bg-orange-100 text-orange-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {parseInt(formData.score) >= 90
                    ? "A"
                    : parseInt(formData.score) >= 80
                    ? "B"
                    : parseInt(formData.score) >= 70
                    ? "C"
                    : parseInt(formData.score) >= 60
                    ? "D"
                    : "F"}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Updating...
              </>
            ) : (
              "Update Score"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
