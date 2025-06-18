"use client";

import api from "@/utils/axios";
import { useState } from "react";
import { FaExclamationTriangle, FaTrash } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";

export default function DeleteScoreModal({
  isOpen,
  onClose,
  onDelete,
  scoreData,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    if (!scoreData) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await api.delete(
        `/scores/students/${scoreData.studentId}/${scoreData.subject._id}/${scoreData.examType}`
      );

      if (response.data.success) {
        onDelete();
        onClose();
        toast.success("Score deleted successfully!");
      } else {
        setError(response.data.message || "Failed to delete score");
      }
    } catch (error) {
      console.error("Error deleting score:", error);
      if (error.response) {
        setError(
          error.response.data?.message ||
            "Failed to delete score. Please try again."
        );
      } else if (error.request) {
        setError("Network error. Please check your connection and try again.");
      } else {
        setError("Failed to delete score. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setError("");
    onClose();
  };

  if (!isOpen || !scoreData) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex justify-center items-center z-50 transition-all duration-200">
      <div className="bg-white w-full max-w-md rounded-xl p-6 shadow-lg relative transform transition-all duration-200">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <IoClose size={20} />
        </button>

        {/* Warning Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <FaExclamationTriangle className="text-red-600 text-2xl" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-800 text-center mb-2">
          Delete Score Record
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Are you sure you want to delete this score record? This action cannot
          be undone.
        </p>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Score Information */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Score Details
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Student:</span>
              <span className="font-medium text-gray-900">
                {scoreData.studentName}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Student ID:</span>
              <span className="font-medium text-gray-900">
                {scoreData.studentIdDisplay || scoreData.studentId}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Subject:</span>
              <span className="font-medium text-gray-900">
                {scoreData.subject?.name || "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Exam Type:</span>
              <span className="font-medium text-gray-900">
                {scoreData.examType}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Score:</span>
              <span className="font-medium text-gray-900">
                {scoreData.score}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date:</span>
              <span className="font-medium text-gray-900">
                {new Date(scoreData.date).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <FaTrash className="text-sm" />
            )}
            {isLoading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
