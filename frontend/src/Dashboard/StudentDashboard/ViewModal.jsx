"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import {
  Award,
  BarChart2,
  BookOpen,
  Calendar,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Shield,
  User,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";

const ViewModal = ({ isOpen, onClose, student }) => {
  const [isLoading, setIsLoading] = useState(false);

  if (!student) return null;

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: 20 },
  };

  const handleClose = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onClose();
    }, 300);
  };

  // Calculate attendance percentage
  const calculateAttendancePercentage = () => {
    if (!student.attendance || student.attendance.length === 0) return 0;
    const presentCount = student.attendance.reduce(
      (acc, curr) => acc + (curr.status === "Present" ? 1 : 0),
      0
    );
    return Math.round((presentCount / student.attendance.length) * 1000) / 10;
  };

  // Calculate average score
  const calculateAverageScore = () => {
    if (!student.scores || student.scores.length === 0) return 0;
    const totalScore = student.scores.reduce((acc, scoreObj) => {
      // Handle both object format and direct number format
      const score = typeof scoreObj === "object" ? scoreObj.score : scoreObj;
      return acc + (Number(score) || 0);
    }, 0);
    return Math.round((totalScore / student.scores.length) * 100) / 100;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog.Root
          open={isOpen}
          onOpenChange={(open) => !open && handleClose()}
        >
          <Dialog.Portal>
            <Dialog.Overlay
              className="fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity z-50"
              asChild
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            </Dialog.Overlay>

            <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto z-50">
              <Dialog.Content asChild>
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={modalVariants}
                  transition={{ type: "spring", duration: 0.5 }}
                  className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl relative overflow-hidden my-8 max-h-[90vh] overflow-y-auto"
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="student-details-title"
                >
                  <Dialog.Close asChild>
                    <button
                      className="absolute right-6 top-6 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-all z-10"
                      aria-label="Close modal"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </Dialog.Close>

                  <div className="p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                      <h2
                        id="student-details-title"
                        className="text-3xl font-bold text-gray-900 mb-2"
                      >
                        {student.name}
                      </h2>
                      <p className="text-gray-500 text-lg">
                        Student ID: {student.studentId}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      {/* Left Section - Profile */}
                      <div className="space-y-6">
                        {/* Profile Image */}
                        <div className="flex justify-center">
                          <div className="relative">
                            <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-gray-100 shadow-lg">
                              <img
                                src={student.profileImage || "/default-avatar.png"}
                                alt={`${student.name}'s profile`}
                                className="object-cover w-full h-full"
                                loading="lazy"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Contact Information */}
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <Mail className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-700 break-all">
                              {student.email}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <Phone className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-700">
                              {student.contact}
                            </span>
                          </div>
                          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                            <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                            <span className="text-sm text-gray-700 break-words">
                              {student.address}
                            </span>
                          </div>
                        </div>

                        {/* Status */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="text-center p-4 bg-green-50 rounded-xl">
                            <Shield className="w-5 h-5 text-green-600 mx-auto mb-2" />
                            <p className="text-xs text-gray-500 mb-1">Status</p>
                            <p className="text-sm font-medium text-green-700">
                              {student.isVerified ? "Verified" : "Pending"}
                            </p>
                          </div>
                          <div className="text-center p-4 bg-blue-50 rounded-xl">
                            <User className="w-5 h-5 text-blue-600 mx-auto mb-2" />
                            <p className="text-xs text-gray-500 mb-1">Admission</p>
                            <p className="text-sm font-medium text-blue-700">
                              {student.isAdmitted ? "Admitted" : "Pending"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Middle Section - Academic Info */}
                      <div className="space-y-6">
                        {/* Academic Details */}
                        <div className="bg-white border border-gray-200 rounded-2xl p-6">
                          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900">
                            <GraduationCap className="w-5 h-5 text-blue-600" />
                            Academic Information
                          </h3>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                              <span className="text-sm text-gray-500">Grade</span>
                              <span className="text-sm font-medium text-gray-900">
                                {student.currentStd || "Not Assigned"}
                              </span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                              <span className="text-sm text-gray-500">Admission Year</span>
                              <span className="text-sm font-medium text-gray-900">
                                {student.admissionYear}
                              </span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                              <span className="text-sm text-gray-500">Role</span>
                              <span className="text-sm font-medium text-gray-900 capitalize">
                                {student.role}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Performance Metrics */}
                        <div className="bg-white border border-gray-200 rounded-2xl p-6">
                          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900">
                            <BarChart2 className="w-5 h-5 text-green-600" />
                            Performance
                          </h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-4 bg-gray-50 rounded-xl">
                              <p className="text-2xl font-bold text-gray-900">
                                {calculateAttendancePercentage()}%
                              </p>
                              <p className="text-xs text-gray-500">Attendance</p>
                            </div>
                            <div className="text-center p-4 bg-gray-50 rounded-xl">
                              <p className="text-2xl font-bold text-gray-900">
                                {calculateAverageScore()}
                              </p>
                              <p className="text-xs text-gray-500">Avg Score</p>
                            </div>
                          </div>
                        </div>

                        {/* Enrolled Courses */}
                        <div className="bg-white border border-gray-200 rounded-2xl p-6">
                          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900">
                            <BookOpen className="w-5 h-5 text-purple-600" />
                            Enrolled Courses
                          </h3>
                          {student.subjects && student.subjects.length > 0 ? (
                            <div className="space-y-2">
                              {student.subjects.map((course, index) => (
                                <div
                                  key={index}
                                  className="p-3 bg-gray-50 rounded-lg text-sm text-gray-700"
                                >
                                  {course.name || course}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-gray-400 text-sm text-center py-4">
                              No courses enrolled
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right Section - Batches & Scores */}
                      <div className="space-y-6">
                        {/* Assigned Batches */}
                        <div className="bg-white border border-gray-200 rounded-2xl p-6">
                          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900">
                            <Users className="w-5 h-5 text-indigo-600" />
                            Assigned Batches
                          </h3>
                          {student.batches && student.batches.length > 0 ? (
                            <div className="space-y-2">
                              {student.batches.map((batch, index) => (
                                <div
                                  key={index}
                                  className="p-3 bg-gray-50 rounded-lg text-sm text-gray-700"
                                >
                                  {batch.name || batch}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-gray-400 text-sm text-center py-4">
                              No batches assigned
                            </p>
                          )}
                        </div>

                        {/* Performance Scores */}
                        <div className="bg-white border border-gray-200 rounded-2xl p-6">
                          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900">
                            <Award className="w-5 h-5 text-yellow-600" />
                            Scores
                          </h3>
                          {student.scores && student.scores.length > 0 ? (
                            <div className="grid grid-cols-2 gap-3">
                              {student.scores.map((scoreObj, index) => {
                                const score =
                                  typeof scoreObj === "object"
                                    ? scoreObj.score
                                    : scoreObj;
                                const examType =
                                  typeof scoreObj === "object"
                                    ? scoreObj.examType
                                    : `Test ${index + 1}`;

                                return (
                                  <div
                                    key={index}
                                    className="text-center p-3 bg-gray-50 rounded-lg"
                                  >
                                    <p className="text-lg font-bold text-gray-900">
                                      {score || "N/A"}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {examType}
                                    </p>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <p className="text-gray-400 text-sm text-center py-4">
                              No scores available
                            </p>
                          )}
                        </div>

                        {/* Account Info */}
                        <div className="bg-white border border-gray-200 rounded-2xl p-6">
                          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900">
                            <Calendar className="w-5 h-5 text-gray-600" />
                            Account Info
                          </h3>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                              <span className="text-sm text-gray-500">Created</span>
                              <span className="text-sm font-medium text-gray-900">
                                {student.createdAt
                                  ? new Date(student.createdAt).toLocaleDateString()
                                  : "N/A"}
                              </span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                              <span className="text-sm text-gray-500">Updated</span>
                              <span className="text-sm font-medium text-gray-900">
                                {student.updatedAt
                                  ? new Date(student.updatedAt).toLocaleDateString()
                                  : "N/A"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Close Button */}
                    <div className="flex justify-center mt-8">
                      <Dialog.Close asChild>
                        <button
                          className="px-8 py-3 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-all focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50"
                          disabled={isLoading}
                        >
                          {isLoading ? "Closing..." : "Close"}
                        </button>
                      </Dialog.Close>
                    </div>
                  </div>
                </motion.div>
              </Dialog.Content>
            </div>
          </Dialog.Portal>
        </Dialog.Root>
      )}
    </AnimatePresence>
  );
};

export default ViewModal;
