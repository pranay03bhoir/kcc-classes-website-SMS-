"use client";

import { useState } from "react";
import { FaMedal } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

function isFutureDate(dateStr) {
  if (!dateStr) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const inputDate = new Date(dateStr);
  return inputDate > today;
}

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
  const [formErrors, setFormErrors] = useState({});

  const resetForm = () => {
    setFormData({
      studentId: "",
      subject: "",
      examType: "",
      score: "",
      date: "",
    });
    setFormErrors({});
  };

  const validate = (data = formData) => {
    const errors = {};
    if (!data.studentId) errors.studentId = "Student is required.";
    if (!data.subject) errors.subject = "Subject is required.";
    if (!data.examType) errors.examType = "Exam type is required.";
    if (!data.score) {
      errors.score = "Score is required.";
    } else if (isNaN(data.score)) {
      errors.score = "Score must be a number.";
    } else if (parseInt(data.score) < 0 || parseInt(data.score) > 100) {
      errors.score = "Score must be between 0 and 100.";
    }
    if (data.date && isFutureDate(data.date)) {
      errors.date = "Date cannot be in the future.";
    }
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFormErrors((prev) => ({
      ...prev,
      [name]: undefined, // clear error on change
    }));
  };

  const handleSubmit = () => {
    const errors = validate();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;
    onSubmit(formData);
    resetForm();
    onClose();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  const isFormValid = Object.keys(validate()).length === 0;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-100/60 via-purple-100/60 to-pink-100/60 backdrop-blur-sm flex justify-center items-center z-50 transition-all duration-200 shadow-2xl">
      <div className="bg-white w-full max-w-2xl rounded-2xl p-0 shadow-2xl relative transform transition-all duration-300 scale-100 hover:scale-[1.01] border border-gray-100 animate-fadeInSlideIn">
        {/* Accent Bar with Glow */}
        <div className="h-2 w-full rounded-t-2xl bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-2 shadow-lg shadow-pink-200/40" />
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-pink-500 hover:scale-125 transition-all duration-200 focus:outline-none"
          aria-label="Close"
        >
          <IoClose size={24} />
        </button>
        {/* Decorative Icon */}
        <div className="flex justify-center items-center mt-2 mb-1">
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 p-3 rounded-full shadow-md">
            <FaMedal className="text-white text-2xl drop-shadow" />
          </span>
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-7 text-center tracking-tight font-sans">
          Add New Score
        </h2>

        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-6 px-8 pb-2"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          {/* Floating Label Input: Student */}
          <div className="relative">
            <select
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              className={`peer w-full px-3 py-3 bg-gray-50 border ${
                formErrors.studentId ? "border-red-400" : "border-gray-300"
              } rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all shadow-sm hover:border-blue-300 appearance-none`}
              required
            >
              <option value="" disabled hidden></option>
              {students &&
                students.map((student) => (
                  <option key={student._id} value={student._id}>
                    {student.name}
                  </option>
                ))}
            </select>
            <label
              className={`absolute left-3 top-2 text-sm font-medium text-gray-700 pointer-events-none transition-all duration-200 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-blue-500 peer-valid:-top-4 peer-valid:text-xs bg-white px-1 ${
                formData.studentId ? "-top-4 text-xs text-blue-500" : ""
              }`}
            >
              Student *
            </label>
            {formErrors.studentId && (
              <p className="text-xs text-red-500 mt-1">
                {formErrors.studentId}
              </p>
            )}
          </div>

          {/* Floating Label Input: Subject */}
          <div className="relative">
            <select
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className={`peer w-full px-3 py-3 bg-gray-50 border ${
                formErrors.subject ? "border-red-400" : "border-gray-300"
              } rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-all shadow-sm hover:border-purple-300 appearance-none`}
              required
            >
              <option value="" disabled hidden></option>
              {subjects &&
                subjects.map((subject) => (
                  <option key={subject._id} value={subject._id}>
                    {subject.name}
                  </option>
                ))}
            </select>
            <label
              className={`absolute left-3 top-2 text-sm font-medium text-gray-700 pointer-events-none transition-all duration-200 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-purple-500 peer-valid:-top-4 peer-valid:text-xs bg-white px-1 ${
                formData.subject ? "-top-4 text-xs text-purple-500" : ""
              }`}
            >
              Subject *
            </label>
            {formErrors.subject && (
              <p className="text-xs text-red-500 mt-1">{formErrors.subject}</p>
            )}
          </div>

          {/* Floating Label Input: Exam Type */}
          <div className="relative">
            <select
              name="examType"
              value={formData.examType}
              onChange={handleChange}
              className={`peer w-full px-3 py-3 bg-gray-50 border ${
                formErrors.examType ? "border-red-400" : "border-gray-300"
              } rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400 transition-all shadow-sm hover:border-pink-300 appearance-none`}
              required
            >
              <option value="" disabled hidden></option>
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
            <label
              className={`absolute left-3 top-2 text-sm font-medium text-gray-700 pointer-events-none transition-all duration-200 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-pink-500 peer-valid:-top-4 peer-valid:text-xs bg-white px-1 ${
                formData.examType ? "-top-4 text-xs text-pink-500" : ""
              }`}
            >
              Exam Type *
            </label>
            {formErrors.examType && (
              <p className="text-xs text-red-500 mt-1">{formErrors.examType}</p>
            )}
          </div>

          {/* Floating Label Input: Score */}
          <div className="relative">
            <input
              type="number"
              name="score"
              value={formData.score}
              onChange={handleChange}
              min="0"
              max="100"
              placeholder=" "
              className={`peer w-full px-3 py-3 bg-gray-50 border ${
                formErrors.score ? "border-red-400" : "border-gray-300"
              } rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all shadow-sm hover:border-blue-300`}
              required
            />
            <label
              className={`absolute left-3 top-2 text-sm font-medium text-gray-700 pointer-events-none transition-all duration-200 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-blue-500 peer-valid:-top-4 peer-valid:text-xs bg-white px-1 ${
                formData.score ? "-top-4 text-xs text-blue-500" : ""
              }`}
            >
              Score (0-100) *
            </label>
            {formErrors.score && (
              <p className="text-xs text-red-500 mt-1">{formErrors.score}</p>
            )}
          </div>

          {/* Floating Label Input: Date */}
          <div className="relative md:col-span-2">
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              placeholder=" "
              className={`peer w-full px-3 py-3 bg-gray-50 border ${
                formErrors.date ? "border-red-400" : "border-gray-300"
              } rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition-all shadow-sm hover:border-purple-300`}
            />
            <label
              className={`absolute left-3 top-2 text-sm font-medium text-gray-700 pointer-events-none transition-all duration-200 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-purple-500 peer-valid:-top-4 peer-valid:text-xs bg-white px-1 ${
                formData.date ? "-top-4 text-xs text-purple-500" : ""
              }`}
            >
              Date
            </label>
            {formErrors.date && (
              <p className="text-xs text-red-500 mt-1">{formErrors.date}</p>
            )}
          </div>
        </form>

        {/* Divider */}
        <div className="border-t border-gray-200 mt-8 mb-0" />

        <div className="mt-6 flex justify-end gap-3 px-8 pb-4">
          <button
            onClick={handleClose}
            className="px-5 py-2 text-sm font-medium text-gray-600 hover:text-white hover:bg-gray-400 rounded-lg transition-colors border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 text-sm font-semibold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-lg shadow-md hover:from-blue-600 hover:to-pink-600 hover:scale-105 transition-all disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-pink-300"
            disabled={!isFormValid}
            type="submit"
          >
            Add Score
          </button>
        </div>
      </div>
      {/* Animation keyframes for fade/slide in */}
      <style jsx global>{`
        @keyframes fadeInSlideIn {
          0% {
            opacity: 0;
            transform: translateY(40px) scale(0.98);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fadeInSlideIn {
          animation: fadeInSlideIn 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </div>
  );
}
