"use client";
import CourseCard from "@/components/CardComponent/CourseCard";
import { Dialog } from "@/components/ui/dialog";
import api from "@/utils/teacher-axios";
import { useEffect, useState } from "react";
import Sidebar from "../SideBar";
import ViewCourseDetails from "./modals/ViewCourseDetails";

const TeacherCourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [teacher, setTeacher] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const getCourseData = async () => {
    try {
      const response = await api.get("/get/teacher/details");
      setTeacher(response.data.teacher);
    } catch (error) {
      console.error("Error in getCourseData:", error);
    }
  };
  const getTeacherCourses = async () => {
    try {
      const response = await api.get("/get/teacher/courses");
      setCourses(response.data.courses);
    } catch (error) {
      console.error("Error in getTeacherCourses:", error);
    }
  };
  useEffect(() => {
    getCourseData();
    getTeacherCourses();
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Sidebar */}
      <Sidebar teacher={teacher} />
      {/* Main Content */}
      <main className="flex-1 transition-all duration-200 md:ml-16 p-4 sm:p-6">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">
              Assigned Courses
            </h1>
            <p className="text-gray-500 text-sm sm:text-md">
              Here are the courses assigned to you. Click on a course to view
              more details.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {courses.map((course, idx) => (
            <CourseCard
              key={course.code}
              title={course.name}
              description={course.description}
              gradeLevel={course.gradeLevel}
              iconUrl={course.imageUrl}
              category={course.code}
              buttonText={"View Details"}
              course={course}
              onViewDetails={(course) => {
                setSelectedCourse(course);
                setModalOpen(true);
              }}
            />
          ))}
        </div>
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          {selectedCourse && (
            <ViewCourseDetails
              course={selectedCourse}
              onClose={() => setModalOpen(false)}
            />
          )}
        </Dialog>
      </main>
    </div>
  );
};

export default TeacherCourseManagement;
