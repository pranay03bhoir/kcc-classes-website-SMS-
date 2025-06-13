"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart2,
  BookOpen,
  Calendar,
  GraduationCap,
  Mail,
  Phone,
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

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog.Root
          open={isOpen}
          onOpenChange={(open) => !open && handleClose()}
        >
          <Dialog.Portal>
            <Dialog.Overlay
              className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
              asChild
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            </Dialog.Overlay>

            <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto">
              <Dialog.Content asChild>
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={modalVariants}
                  transition={{ type: "spring", duration: 0.5 }}
                  className="w-full max-w-4xl bg-white rounded-2xl p-8 shadow-2xl relative grid grid-cols-1 lg:grid-cols-2 gap-8 my-8"
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="student-details-title"
                >
                  <Dialog.Close asChild>
                    <button
                      className="absolute right-6 top-6 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                      aria-label="Close modal"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </Dialog.Close>

                  {/* Left Section */}
                  <div className="flex flex-col items-center text-center space-y-6">
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

                    <div className="space-y-4">
                      <h2
                        id="student-details-title"
                        className="text-2xl font-bold text-gray-800"
                      >
                        {student.name}
                      </h2>

                      <div className="space-y-3 text-left">
                        <div className="flex items-center gap-3 text-gray-600">
                          <Mail className="w-5 h-5 text-orange-500" />
                          <span>{student.email}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-600">
                          <Phone className="w-5 h-5 text-orange-500" />
                          <span>{student.contact}</span>
                        </div>
                        {student.parentsContact.map((contact, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 text-gray-600"
                          >
                            <Phone className="w-5 h-5 text-orange-500" />
                            <span>
                              Parent {index + 1}: {contact}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                        <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                          <GraduationCap className="w-5 h-5 text-orange-500 mb-1" />
                          <span className="text-sm text-gray-500">
                            Student ID
                          </span>
                          <span className="font-medium">
                            {student.studentId}
                          </span>
                        </div>
                        <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                          <BookOpen className="w-5 h-5 text-orange-500 mb-1" />
                          <span className="text-sm text-gray-500">Grade</span>
                          <span className="font-medium">
                            {student.currentStd}
                          </span>
                        </div>
                        <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                          <Calendar className="w-5 h-5 text-orange-500 mb-1" />
                          <span className="text-sm text-gray-500">
                            Admission
                          </span>
                          <span className="font-medium">
                            {student.admissionYear}
                          </span>
                        </div>
                        <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                          <BarChart2 className="w-5 h-5 text-orange-500 mb-1" />
                          <span className="text-sm text-gray-500">
                            Attendance
                          </span>
                          <span className="font-medium">
                            {student.attendance.length > 0
                              ? Math.round(
                                  (student.attendance.reduce(
                                    (acc, curr) =>
                                      acc + (curr.status === "Present" ? 1 : 0),
                                    0
                                  ) /
                                    student.attendance.length) *
                                    1000
                                ) / 10
                              : 0}
                            %
                          </span>
                        </div>
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

                  {/* Right Section */}
                  <div className="flex flex-col gap-6">
                    {/* Enrolled Courses */}
                    <div className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-xl p-6 shadow-sm border border-orange-100">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
                        <BookOpen className="w-5 h-5 text-orange-500" />
                        Enrolled Courses
                      </h3>
                      {student.subjects.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {student.subjects.map((course, index) => (
                            <div
                              key={index}
                              className="bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-sm border border-orange-100 hover:shadow-md transition-shadow"
                            >
                              <span className="text-gray-700">
                                {course.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-400 italic">
                          No courses enrolled yet
                        </p>
                      )}
                    </div>

                    {/* Batches */}
                    <div className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-xl p-6 shadow-sm border border-orange-100">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
                        <Users className="w-5 h-5 text-orange-500" />
                        Assigned Batches
                      </h3>
                      {student.batches.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {student.batches.map((batch, index) => (
                            <div
                              key={index}
                              className="bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-sm border border-orange-100 hover:shadow-md transition-shadow"
                            >
                              <span className="text-gray-700">
                                {batch.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-400 italic">
                          No batches assigned
                        </p>
                      )}
                    </div>

                    {/* Scores */}
                    <div className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-xl p-6 shadow-sm border border-orange-100">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
                        <BarChart2 className="w-5 h-5 text-orange-500" />
                        Performance Scores
                      </h3>
                      {student.scores.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {student.scores.map((score, index) => (
                            <div
                              key={index}
                              className="bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-sm border border-orange-100 text-center"
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
                        <p className="text-gray-400 italic">
                          No scores available
                        </p>
                      )}
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
