"use client";
import { Dialog } from "@headlessui/react";
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
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-3xl rounded-xl bg-white p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <Dialog.Title className="text-xl font-semibold">
              Bulk Add Grades
            </Dialog.Title>
            <button onClick={onClose}>
              <IoClose className="w-6 h-6" />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {/* Form */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">Subject</label>
              <select
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
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
              <label className="block text-sm font-medium mb-1">
                Exam Type
              </label>
              <select
                value={examType}
                onChange={(e) => setExamType(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                {examTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
          </div>

          {/* Student Scores */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-4">
              Students in{" "}
              {subjects.find((s) => s._id === subjectId)?.name ||
                "Selected Subject"}
            </h3>
            {students.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No students available
              </p>
            ) : (
              students.map((student) => (
                <div
                  key={student._id}
                  className="flex items-center justify-between mb-3 bg-white px-4 py-3 rounded-md border"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">👤</span>
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-sm text-gray-500">
                        {student.studentId}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Score (0-100)"
                      min="0"
                      max="100"
                      value={scores[student._id] || ""}
                      onChange={(e) =>
                        handleScoreChange(student._id, e.target.value)
                      }
                      className="w-24 border border-gray-300 rounded-md px-2 py-1 text-right"
                    />
                    <span className="text-gray-500">/ 100</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 mt-6">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Save Grades"}
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
