"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

const ViewModal = ({ isOpen, onClose, student }) => {
  if (!student) return null;

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
          <Dialog.Portal>
            {/* Overlay */}
            <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm" />

            {/* Content */}
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <Dialog.Content asChild>
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={modalVariants}
                  transition={{ duration: 0.3 }}
                  className="w-full max-w-4xl bg-white rounded-2xl p-8 shadow-2xl relative grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  {/* Close Button */}
                  <Dialog.Close asChild>
                    <button
                      className="absolute right-6 top-6 text-gray-500 hover:text-gray-700"
                      aria-label="Close"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </Dialog.Close>

                  {/* Left Section */}
                  <div className="flex flex-col items-center text-center">
                    <div className="w-32 h-32 rounded-full overflow-hidden mb-4">
                      {/* Profile photo */}
                      <img
                        src={student.profileImage || "/default-avatar.png"}
                        alt={student.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <h2 className="text-xl font-semibold">{student.name}</h2>
                    <p className="text-gray-500">
                      <strong>Email: </strong>
                      {student.email}
                    </p>
                    <p className="text-gray-500">
                      <strong>Contact: </strong>
                      {student.contact}
                    </p>
                    <strong className="text-gray-500">
                      {student.parentsContact.map((contact, index) => (
                        // Display each parent's contact number
                        // with a comma separator
                        <p key={index}>
                          <strong>Parents Contact {[index + 1]} : </strong>
                          {contact}
                          {index < student.parentsContact.length - 1
                            ? ", "
                            : ""}
                        </p>
                      ))}
                    </strong>

                    <div className="mt-6 flex flex-col gap-2">
                      <span className="text-sm text-gray-400">
                        Student ID: {student.studentId}
                      </span>
                      <span className="text-sm text-gray-400">
                        Grade: {student.currentStd}
                      </span>
                      <span className="text-sm text-gray-400">
                        Admission Year: {student.admissionYear}
                      </span>
                    </div>

                    <Dialog.Close asChild>
                      <button className="mt-6 px-6 py-2 bg-gradient-to-r from-orange-400 to-pink-500 text-white rounded-full hover:opacity-90 transition">
                        Close
                      </button>
                    </Dialog.Close>
                  </div>

                  {/* Right Section */}
                  <div className="flex flex-col gap-6">
                    {/* Enrolled Courses */}
                    <div className="bg-gray-50 rounded-xl p-4 shadow">
                      <h3 className="text-lg font-semibold mb-2">
                        Enrolled Courses
                      </h3>
                      {student.subjects.length > 0 ? (
                        <ul className="text-sm text-gray-700 space-y-1">
                          {student.subjects.map((course, index) => (
                            <li key={index}>• {course.name}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-400">No enrolled courses</p>
                      )}
                    </div>

                    {/* Batches */}
                    <div className="bg-gray-50 rounded-xl p-4 shadow">
                      <h3 className="text-lg font-semibold mb-2">Batches</h3>
                      {student.batches.length > 0 ? (
                        <p className="text-sm text-gray-700">
                          {student.batches.map((batch, index) => (
                            <span key={index} className="block">
                              • {batch.name}
                            </span>
                          ))}
                        </p>
                      ) : (
                        <p className="text-gray-400">No batches assigned</p>
                      )}
                    </div>

                    {/* Attendance & Scores */}
                    <div className="bg-gray-50 rounded-xl p-4 shadow">
                      <h3 className="text-lg font-semibold mb-2">
                        Attendance & Scores
                      </h3>
                      <div className="flex flex-col text-sm text-gray-700 space-y-1">
                        <p>Attendance: {student.attendance}%</p>
                        <p>Scores: {student.scores.join(", ")}</p>
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
