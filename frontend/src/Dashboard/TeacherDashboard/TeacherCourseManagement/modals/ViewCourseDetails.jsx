"use client";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";

function getInitials(name) {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const DEFAULT_PROFILE = "/images/default-profile.png";

const ViewCourseDetails = ({ course, onClose }) => {
  const [imgError, setImgError] = useState({});
  if (!course) return null;
  return (
    <DialogContent className="max-w-full sm:max-w-lg p-2 sm:p-6 max-h-screen sm:max-h-[70vh] overflow-y-auto">
      <div className="flex flex-col h-full">
        <DialogHeader>
          <DialogTitle>{course.name}</DialogTitle>
          <DialogDescription>{course.description}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 mt-4">
          <img
            src={course.imageUrl}
            alt={course.name}
            className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-full border"
          />
          <div className="flex flex-wrap gap-2 justify-center">
            <span className="bg-blue-200 text-blue-800 px-2 sm:px-3 py-1 rounded-full text-xs font-semibold">
              {course.category}
            </span>
            <span className="bg-pink-200 text-pink-800 px-2 sm:px-3 py-1 rounded-full text-xs font-semibold">
              {course.gradeLevel}
            </span>
            <span className="bg-yellow-200 text-yellow-800 px-2 sm:px-3 py-1 rounded-full text-xs font-semibold">
              Code: {course.code}
            </span>
          </div>
          <div className="flex flex-col gap-1 text-xs sm:text-sm text-gray-700 w-full max-w-xs sm:max-w-md">
            <div>
              <strong>Duration:</strong> {course.duration}
            </div>
            <div>
              <strong>Classes per week:</strong> {course.classesPerWeek}
            </div>
            <div>
              <strong>Rating:</strong> {course.rating} / 5
            </div>
            {course.isPopular && (
              <div className="text-yellow-600 font-bold">Popular Course</div>
            )}
          </div>
        </div>
        {/* Students Section */}
        <div className="mt-8 w-full flex-1">
          <h3 className="text-base sm:text-lg font-semibold mb-2 text-center sm:text-left">
            Enrolled Students
          </h3>
          {course.students && course.students.length > 0 ? (
            <div className="max-h-48 sm:max-h-40 overflow-y-auto divide-y divide-gray-200 rounded-md border border-gray-100 bg-gray-50">
              {course.students.map((student) => {
                const showFallback =
                  !student.profileImage ||
                  imgError[student._id || student.studentId];
                return (
                  <div
                    key={student._id || student.studentId}
                    className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 p-2 sm:p-3"
                  >
                    {showFallback ? (
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-gray-300 text-gray-700 font-bold text-xs sm:text-base border select-none">
                        {getInitials(student.name)}
                      </div>
                    ) : (
                      <img
                        src={student.profileImage}
                        alt={student.name}
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border"
                        onError={() =>
                          setImgError((prev) => ({
                            ...prev,
                            [student._id || student.studentId]: true,
                          }))
                        }
                      />
                    )}
                    <div className="flex-1 text-center sm:text-left">
                      <div className="font-medium text-gray-900 text-xs sm:text-sm">
                        {student.name}
                      </div>
                      <div className="text-xs text-gray-600 break-all">
                        {student.email}
                      </div>
                      <div className="text-xs text-gray-600">
                        Contact: {student.contact}
                      </div>
                      <div className="text-xs text-gray-600">
                        ID: {student.studentId} | Year: {student.admissionYear}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-gray-500 italic text-center">
              No students enrolled in this course.
            </div>
          )}
        </div>
        <button
          onClick={onClose}
          className="mt-6 w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-2 rounded-md transition-colors duration-200 text-sm"
        >
          Close
        </button>
      </div>
    </DialogContent>
  );
};

export default ViewCourseDetails;
