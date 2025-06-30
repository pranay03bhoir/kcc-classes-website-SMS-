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
    studentId: "",
    subject: "",
    examType: "",
    score: "",
    date: "",
  });

  const resetForm = () => {
    setFormData({
      studentId: "",
      subject: "",
      examType: "",
      score: "",
      date: "",
    });
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = () => {
    // Validate required fields
    if (
      !formData.studentId ||
      !formData.subject ||
      !formData.examType ||
      !formData.score
    ) {
      alert("Please fill in all required fields");
      return;
    }

    // Validate score range (0-100)
    const score = parseInt(formData.score);
    if (score < 0 || score > 100) {
      alert("Score must be between 0 and 100");
      return;
    }

    onSubmit(formData);
    resetForm();
    onClose();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center transition-all duration-200 bg-gradient-to-br from-blue-100/60 via-white/80 to-pink-100/60 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl p-0 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden transform transition-all duration-200">
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-pink-500 transition-colors bg-white/80 rounded-full p-2 shadow-md hover:scale-110 focus:outline-none focus:ring-2 focus:ring-pink-300"
          aria-label="Close modal"
        >
          <IoClose size={24} />
        </button>

        <div className="flex items-center gap-3 px-8 pt-8 pb-3">
          <span className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-tr from-pink-400 to-blue-400 text-white rounded-full shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6l4 2"
              />
              <circle
                cx="12"
                cy="12"
                r="9"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
              />
            </svg>
          </span>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
            Add New Score
          </h2>
        </div>
        <div className="border-b border-gray-100 mx-8 mb-6" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-8 pb-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Student <span className="text-pink-500">*</span>
            </label>
            <select
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all shadow-sm hover:border-pink-300"
              required
            >
              <option value="">Select student</option>
              {students &&
                students.map((student) => (
                  <option key={student._id} value={student._id}>
                    {student.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Subject <span className="text-pink-500">*</span>
            </label>
            <select
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all shadow-sm hover:border-pink-300"
              required
            >
              <option value="">Select subject</option>
              {subjects &&
                subjects.map((subject) => (
                  <option key={subject._id} value={subject._id}>
                    {subject.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Exam Type <span className="text-pink-500">*</span>
            </label>
            <select
              name="examType"
              value={formData.examType}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all shadow-sm hover:border-pink-300"
              required
            >
              <option value="">Select exam type</option>
              <option value="Midterm">Midterm</option>
              <option value="Final">Final</option>
              <option value="Quiz">Quiz</option>
              <option value="Assignment">Assignment</option>
              <option value="Board">Board</option>
              <option value="JEE">JEE</option>
              <option value="NEET">NEET</option>
              <option value="JEE Mains">JEE Mains</option>
              <option value="JEE Advanced">JEE Advanced</option>
              <option value="MH CET">MH CET</option>
              <option value="NEET UG">NEET UG</option>
              <option value="NEET UA">NEET UA</option>
              <option value="NEET PG">NEET PG</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Score (0-100) <span className="text-pink-500">*</span>
            </label>
            <input
              type="number"
              name="score"
              value={formData.score}
              onChange={handleChange}
              min="0"
              max="100"
              placeholder="Enter score (0-100)"
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all shadow-sm hover:border-pink-300"
              required
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all shadow-sm hover:border-pink-300"
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3 px-8 pb-8">
          <button
            onClick={handleClose}
            className="px-5 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 hover:text-gray-900 rounded-lg transition-all duration-150 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 text-sm font-semibold bg-gradient-to-tr from-pink-500 to-blue-500 text-white rounded-lg shadow-md hover:scale-105 hover:from-pink-600 hover:to-blue-600 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-pink-300"
          >
            Add Score
          </button>
        </div>
      </div>
    </div>
  );
}
