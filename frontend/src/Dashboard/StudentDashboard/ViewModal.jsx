"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import {
  Award,
  BarChart2,
  BookOpen,
  Clock,
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
    const totalScore = student.scores.reduce((acc, score) => acc + score, 0);
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
              className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity z-50"
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
                  className="w-full max-w-6xl bg-white rounded-2xl p-8 shadow-2xl relative grid grid-cols-1 lg:grid-cols-3 gap-8 my-8 max-h-[90vh] overflow-y-auto"
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="student-details-title"
                >
                  <Dialog.Close asChild>
                    <button
                      className="absolute right-6 top-6 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors z-10"
                      aria-label="Close modal"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </Dialog.Close>

                  {/* Left Section - Profile Information */}
                  <div className="lg:col-span-1 flex flex-col items-center text-center space-y-6">
                    <div className="relative group">
                      <div className="w-40 h-40 rounded-full overflow-hidden ring-4 ring-orange-100 shadow-lg transition-transform group-hover:scale-105">
                        <img
                          src={student.profileImage || "/default-avatar.png"}
                          alt={`${student.name}'s profile`}
                          className="object-cover w-full h-full"
                          loading="lazy"
                        />
                      </div>
                      <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    <div className="space-y-4 w-full">
                      <h2
                        id="student-details-title"
                        className="text-2xl font-bold text-gray-800"
                      >
                        {student.name}
                      </h2>

                      {/* Basic Information */}
                      <div className="space-y-3 text-left bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center gap-3 text-gray-600">
                          <Mail className="w-5 h-5 text-orange-500 flex-shrink-0" />
                          <span className="break-all">{student.email}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-600">
                          <Phone className="w-5 h-5 text-orange-500 flex-shrink-0" />
                          <span>{student.contact}</span>
                        </div>
                        <div className="flex items-start gap-3 text-gray-600">
                          <MapPin className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                          <span className="break-words">{student.address}</span>
                        </div>
                      </div>

                      {/* Parent Contacts */}
                      {student.parentsContact &&
                        student.parentsContact.length > 0 && (
                          <div className="space-y-3 text-left bg-blue-50 rounded-lg p-4">
                            <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                              <Users className="w-4 h-4 text-blue-500" />
                              Parent Contacts
                            </h4>
                            {student.parentsContact.map((contact, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-3 text-gray-600"
                              >
                                <Phone className="w-4 h-4 text-blue-500 flex-shrink-0" />
                                <span>
                                  Parent {index + 1}: {contact}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                      {/* Status Cards */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col items-center p-3 bg-green-50 rounded-lg">
                          <Shield className="w-5 h-5 text-green-500 mb-1" />
                          <span className="text-xs text-gray-500">Status</span>
                          <span className="font-medium text-green-700">
                            {student.isVerified ? "Verified" : "Pending"}
                          </span>
                        </div>
                        <div className="flex flex-col items-center p-3 bg-blue-50 rounded-lg">
                          <User className="w-5 h-5 text-blue-500 mb-1" />
                          <span className="text-xs text-gray-500">
                            Admission
                          </span>
                          <span className="font-medium text-blue-700">
                            {student.isAdmitted ? "Admitted" : "Pending"}
                          </span>
                        </div>
                      </div>

                      <Dialog.Close asChild>
                        <button
                          className="px-8 py-3 bg-gradient-to-r from-orange-400 to-pink-500 text-white rounded-full hover:opacity-90 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50"
                          disabled={isLoading}
                        >
                          {isLoading ? "Closing..." : "Close"}
                        </button>
                      </Dialog.Close>
                    </div>
                  </div>

                  {/* Middle Section - Academic Information */}
                  <div className="lg:col-span-1 flex flex-col gap-6">
                    {/* Academic Details */}
                    <div className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-xl p-6 shadow-sm border border-orange-100">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
                        <GraduationCap className="w-5 h-5 text-orange-500" />
                        Academic Information
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-sm border border-orange-100">
                          <span className="text-sm text-gray-500">
                            Student ID
                          </span>
                          <p className="font-medium text-gray-800">
                            {student.studentId}
                          </p>
                        </div>
                        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-sm border border-orange-100">
                          <span className="text-sm text-gray-500">
                            Current Grade
                          </span>
                          <p className="font-medium text-gray-800">
                            {student.currentStd || "Not Assigned"}
                          </p>
                        </div>
                        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-sm border border-orange-100">
                          <span className="text-sm text-gray-500">
                            Admission Year
                          </span>
                          <p className="font-medium text-gray-800">
                            {student.admissionYear}
                          </p>
                        </div>
                        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-sm border border-orange-100">
                          <span className="text-sm text-gray-500">Role</span>
                          <p className="font-medium text-gray-800 capitalize">
                            {student.role}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Performance Metrics */}
                    <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 shadow-sm border border-green-100">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
                        <BarChart2 className="w-5 h-5 text-green-500" />
                        Performance Metrics
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-sm border border-green-100 text-center">
                          <span className="text-sm text-gray-500">
                            Attendance
                          </span>
                          <p className="text-lg font-semibold text-gray-800">
                            {calculateAttendancePercentage()}%
                          </p>
                        </div>
                        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-sm border border-green-100 text-center">
                          <span className="text-sm text-gray-500">
                            Avg Score
                          </span>
                          <p className="text-lg font-semibold text-gray-800">
                            {calculateAverageScore()}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Enrolled Courses */}
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 shadow-sm border border-purple-100">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
                        <BookOpen className="w-5 h-5 text-purple-500" />
                        Enrolled Courses
                      </h3>
                      {student.subjects && student.subjects.length > 0 ? (
                        <div className="grid grid-cols-1 gap-3">
                          {student.subjects.map((course, index) => (
                            <div
                              key={index}
                              className="bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-sm border border-purple-100 hover:shadow-md transition-shadow"
                            >
                              <span className="text-gray-700 font-medium">
                                {course.name || course}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-400 italic text-center py-4">
                          No courses enrolled yet
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right Section - Batches and Scores */}
                  <div className="lg:col-span-1 flex flex-col gap-6">
                    {/* Assigned Batches */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 shadow-sm border border-blue-100">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
                        <Users className="w-5 h-5 text-blue-500" />
                        Assigned Batches
                      </h3>
                      {student.batches && student.batches.length > 0 ? (
                        <div className="grid grid-cols-1 gap-3">
                          {student.batches.map((batch, index) => (
                            <div
                              key={index}
                              className="bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-sm border border-blue-100 hover:shadow-md transition-shadow"
                            >
                              <span className="text-gray-700 font-medium">
                                {batch.name || batch}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-400 italic text-center py-4">
                          No batches assigned
                        </p>
                      )}
                    </div>

                    {/* Performance Scores */}
                    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 shadow-sm border border-yellow-100">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
                        <Award className="w-5 h-5 text-yellow-500" />
                        Performance Scores
                      </h3>
                      {student.scores && student.scores.length > 0 ? (
                        <div className="grid grid-cols-2 gap-3">
                          {student.scores.map((score, index) => (
                            <div
                              key={index}
                              className="bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-sm border border-yellow-100 text-center"
                            >
                              <span className="text-sm text-gray-500">
                                Test {index + 1}
                              </span>
                              <p className="text-lg font-semibold text-gray-800">
                                {score}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-400 italic text-center py-4">
                          No scores available
                        </p>
                      )}
                    </div>

                    {/* Account Information */}
                    <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-6 shadow-sm border border-gray-100">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
                        <Clock className="w-5 h-5 text-gray-500" />
                        Account Information
                      </h3>
                      <div className="space-y-3">
                        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-sm border border-gray-100">
                          <span className="text-sm text-gray-500">Created</span>
                          <p className="font-medium text-gray-800">
                            {student.createdAt
                              ? new Date(student.createdAt).toLocaleDateString()
                              : "N/A"}
                          </p>
                        </div>
                        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-sm border border-gray-100">
                          <span className="text-sm text-gray-500">
                            Last Updated
                          </span>
                          <p className="font-medium text-gray-800">
                            {student.updatedAt
                              ? new Date(student.updatedAt).toLocaleDateString()
                              : "N/A"}
                          </p>
                        </div>
                      </div>
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
