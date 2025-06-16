"use client";

import { useState } from "react";
import { IoClose } from "react-icons/io5";

export default function AddScoreModal({
  isOpen,
  onClose,
  onSubmit,
  students,
  subjects,
}) {
  const [formData, setFormData] = useState({
    student: "",
    subject: "",
    type: "",
    name: "",
    score: "",
    total: "",
    date: "",
    comments: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex justify-center items-center z-50 transition-all duration-200">
      <div className="bg-white w-full max-w-2xl rounded-xl p-8 shadow-sm relative transform transition-all duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <IoClose size={20} />
        </button>

        <h2 className="text-lg font-medium text-gray-800 mb-6">
          Add New Grade
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1">
            <label className="text-sm text-gray-600">Student</label>
            <select
              name="student"
              value={formData.student}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 transition-all"
            >
              <option>Select student</option>
              <option>John Smith</option>
              <option>Sarah Johnson</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-sm text-gray-600">Subject</label>
            <select
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 transition-all"
            >
              <option>Select subject</option>
              <option>Mathematics</option>
              <option>Physics</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-sm text-gray-600">Assessment Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 transition-all"
            >
              <option>Select type</option>
              <option>Exam</option>
              <option>Quiz</option>
              <option>Assignment</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-sm text-gray-600">Assessment Name</label>
            <input
              type="text"
              name="name"
              placeholder="e.g., Midterm Exam"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm text-gray-600">Score Obtained</label>
            <input
              type="number"
              name="score"
              value={formData.score}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm text-gray-600">Total Marks</label>
            <input
              type="number"
              name="total"
              value={formData.total}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 transition-all"
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
        </div>

        <div className="mt-5 space-y-1">
          <label className="text-sm text-gray-600">Comments (Optional)</label>
          <textarea
            name="comments"
            value={formData.comments}
            onChange={handleChange}
            placeholder="Add any comments about the assessment"
            rows={3}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 transition-all resize-none"
          />
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Add Grade
          </button>
        </div>
      </div>
    </div>
  );
}
