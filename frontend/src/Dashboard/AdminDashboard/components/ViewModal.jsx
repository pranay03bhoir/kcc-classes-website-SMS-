import { Dialog } from "@headlessui/react";
import { motion } from "framer-motion"; // Import motion from framer-motion

const StudentDetailModal = ({ isOpen, onClose, student }) => {
  if (!student) return null;

  // Animation variants for Framer Motion
  const modalVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />

      {/* Modal Content with Framer Motion animation */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={modalVariants}
          transition={{ duration: 0.3 }}
          className="w-full max-w-4xl rounded-lg bg-white p-8 shadow-lg"
        >
          <Dialog.Panel>
            <Dialog.Title className="text-2xl font-semibold mb-4 text-center">
              Student Details
            </Dialog.Title>

            {/* Student Info Section */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">
                Student Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <p>
                  <strong>Name:</strong> {student.name}
                </p>
                <p>
                  <strong>Email:</strong> {student.email}
                </p>
                <p>
                  <strong>Student ID:</strong> {student.studentId}
                </p>
                <p>
                  <strong>Grade:</strong> {student.grade}
                </p>
                <p>
                  <strong>Admission Year:</strong> {student.admissionYear}
                </p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">
                Contact Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <p>
                  <strong>Contact:</strong> {student.contact}
                </p>
                <p>
                  <strong>Parent's Contact:</strong>{" "}
                  {student.parentsContact.join(", ")}
                </p>
              </div>
            </div>

            {/* Enrolled Courses Section */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Enrolled Courses</h3>
              <div className="grid grid-cols-2 gap-4">
                {student.subjects.length > 0 ? (
                  student.subjects.map((course, index) => (
                    <p key={index}>
                      <strong>Course {index + 1}:</strong> {course.name}
                    </p>
                  ))
                ) : (
                  <p>No enrolled courses</p>
                )}
              </div>
            </div>

            {/* Subjects and Batches Section */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Batches</h3>
              <div className="grid grid-cols-2 gap-4">
                <p>
                  <strong>Batches:</strong> {student.batches.join(", ")}
                </p>
              </div>
            </div>

            {/* Attendance and Scores Section */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">
                Attendance and Scores
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <p>
                  <strong>Attendance:</strong> {student.attendance}%
                </p>
                <p>
                  <strong>Scores:</strong> {student.scores.join(", ")}
                </p>
              </div>
            </div>

            {/* Close Button */}
            <div className="mt-6 text-center">
              <button
                onClick={onClose}
                className="bg-red-500 text-white py-2 px-6 rounded hover:bg-red-600 transition duration-200"
              >
                Close
              </button>
            </div>
          </Dialog.Panel>
        </motion.div>
      </div>
    </Dialog>
  );
};

export default StudentDetailModal;
