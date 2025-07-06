"use client";
import { Dialog } from "@/components/ui/dialog";
import Sidebar from "@/Dashboard/StudentDashboard/SideBar";
import { useStudentAuth } from "@/hooks/useStudentAuth";
import api from "@/utils/student-axios";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  BookOpen,
  Calendar,
  Clock,
  GraduationCap,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import StudentCourseViewModal from "./StudentCourseViewModal";

const StudentEnrolledCourses = () => {
  const [subjects, setSubjects] = useState([]);
  const [student, setStudent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { refreshToken } = useStudentAuth();

  useEffect(() => {
    const fetchData = async () => {
      const toastId = toast.loading("Loading your enrolled courses...");
      try {
        const response = await api.get("/get/student/details");
        setSubjects(response.data.student.subjects);
        setStudent(response.data.student);

        setLoading(false);

        if (response.data.success) {
          toast.update(toastId, {
            render: "Student details loaded successfully",
            type: "success",
            isLoading: false,
            autoClose: 2000,
          });
        } else {
          toast.update(toastId, {
            render: response?.data?.message || "Failed to load student details",
            type: "error",
            isLoading: false,
            autoClose: 2000,
          });
        }
      } catch (error) {
        if (error.response?.status === 401) {
          const refreshSuccess = await refreshToken();
          if (refreshSuccess) {
            const response = await api.get("/get/student/details");
            setSubjects(response.data.student.subjects);
            setStudent(response.data.student);
            setLoading(false);
            return;
          }
        }
        console.error("Error fetching data:", error);
        setLoading(false);
        toast.update(toastId, {
          render: error?.response?.data?.message,
          type: "error",
          isLoading: false,
          autoClose: 2000,
        });
      }
    };
    fetchData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const getCategoryColor = (category) => {
    const colors = {
      Science: "bg-gradient-to-r from-blue-500 to-cyan-500",
      Mathematics: "bg-gradient-to-r from-purple-500 to-pink-500",
      English: "bg-gradient-to-r from-green-500 to-emerald-500",
      History: "bg-gradient-to-r from-orange-500 to-red-500",
      Geography: "bg-gradient-to-r from-teal-500 to-blue-500",
      default: "bg-gradient-to-r from-indigo-500 to-purple-500",
    };
    return colors[category] || colors.default;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-16">
        <div className="fixed inset-y-0 left-0 z-40 md:relative md:z-auto">
          <Sidebar student={student} />
        </div>
        <div className="flex-1 w-full md:ml-16 p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-16">
      {/* Sidebar - Fixed on desktop, overlay on mobile */}
      <div className="fixed inset-y-0 left-0 z-40 md:relative md:z-auto">
        <Sidebar student={student} />
      </div>

      {/* Main content area */}
      <div className="flex-1 md:ml-16 p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            My Enrolled Courses
          </h1>
          <p className="text-gray-600">
            Track your learning progress and course details
          </p>
        </motion.div>

        {Array.isArray(subjects) && subjects.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-6 max-w-6xl"
          >
            {subjects.map(
              (course, index) =>
                course && (
                  <motion.div
                    key={index}
                    variants={cardVariants}
                    className="group relative"
                  >
                    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                      <div className="flex flex-col lg:flex-row">
                        {/* Course Header */}
                        <div
                          className={`lg:w-1/3 p-6 text-white relative overflow-hidden ${getCategoryColor(
                            course.category
                          )}`}
                        >
                          <div className="absolute inset-0 bg-black/10"></div>
                          <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                              <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium backdrop-blur-sm">
                                {course.category}
                              </span>
                              <BookOpen className="w-6 h-6 opacity-80" />
                            </div>

                            <h2 className="text-2xl font-bold mb-2 leading-tight">
                              {course.name}
                            </h2>

                            <p className="text-sm opacity-90 mb-4">
                              Code: {course.code}
                            </p>

                            <div className="flex items-center space-x-4 text-sm">
                              <div className="flex items-center space-x-1">
                                <Clock className="w-4 h-4" />
                                <span>{course.duration}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <GraduationCap className="w-4 h-4" />
                                <span>{course.gradeLevel}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Course Details */}
                        <div className="lg:w-2/3 p-6">
                          <div className="mb-4">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                              Course Description
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                              {course.description}
                            </p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                              <Users className="w-5 h-5 text-indigo-600" />
                              <div>
                                <p className="text-sm font-medium text-gray-700">
                                  Teachers
                                </p>
                                <p className="text-sm text-gray-600">
                                  {course.teachers &&
                                  Array.isArray(course.teachers) &&
                                  course.teachers.length > 0
                                    ? course.teachers
                                        .map((teacher) => teacher.name)
                                        .join(", ")
                                    : "To be assigned"}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                              <Award className="w-5 h-5 text-green-600" />
                              <div>
                                <p className="text-sm font-medium text-gray-700">
                                  Category
                                </p>
                                <p className="text-sm text-gray-600">
                                  {course.category}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                              <Calendar className="w-4 h-4" />
                              <span>Enrolled recently</span>
                            </div>

                            <button
                              onClick={() => {
                                // Create a course object with scores and attendance data
                                const courseWithData = {
                                  ...course,
                                  scores: student.scores
                                    ? student.scores.filter((score) => {
                                        if (!score.subject) return false;
                                        // Handle both populated and unpopulated subject cases
                                        const subjectId = score.subject._id
                                          ? score.subject._id.toString()
                                          : score.subject.toString();
                                        return (
                                          subjectId === course._id.toString()
                                        );
                                      })
                                    : [],
                                  attendance: student.attendance
                                    ? student.attendance.filter((att) => {
                                        if (!att.subject) return false;
                                        // Handle both populated and unpopulated subject cases for attendance
                                        const subjectId = att.subject._id
                                          ? att.subject._id.toString()
                                          : att.subject.toString();
                                        return (
                                          subjectId === course._id.toString()
                                        );
                                      })
                                    : [],
                                  batches: student.batches
                                    ? student.batches.filter(
                                        (batch) =>
                                          batch.subjectId &&
                                          batch.subjectId.toString() ===
                                            course._id.toString()
                                      )
                                    : [],
                                };

                                setSelectedCourse(courseWithData);
                                setModalOpen(true);
                              }}
                              className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 group-hover:shadow-md"
                            >
                              <span>View Details</span>
                              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-16"
          >
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                No Courses Enrolled Yet
              </h3>
              <p className="text-gray-600 mb-6">
                You haven't enrolled in any courses yet. Explore our course
                catalog to get started with your learning journey.
              </p>
              <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200">
                Browse Courses
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Course Details Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        {selectedCourse && (
          <StudentCourseViewModal
            course={selectedCourse}
            onClose={() => setModalOpen(false)}
          />
        )}
      </Dialog>
    </div>
  );
};

export default StudentEnrolledCourses;
