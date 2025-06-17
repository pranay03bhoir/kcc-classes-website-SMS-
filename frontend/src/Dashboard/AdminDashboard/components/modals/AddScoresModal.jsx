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
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex justify-center items-center z-50 transition-all duration-200">
      <div className="bg-white w-full max-w-2xl rounded-xl p-8 shadow-sm relative transform transition-all duration-200">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <IoClose size={20} />
        </button>

        <h2 className="text-lg font-medium text-gray-800 mb-6">
          Add New Score
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1">
            <label className="text-sm text-gray-600">Student *</label>
            <select
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 transition-all"
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

          <div className="space-y-1">
            <label className="text-sm text-gray-600">Subject *</label>
            <select
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 transition-all"
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

          <div className="space-y-1">
            <label className="text-sm text-gray-600">Exam Type *</label>
            <select
              name="examType"
              value={formData.examType}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 transition-all"
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
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Add Score
          </button>
        </div>
      </div>
    </div>
  );
}
