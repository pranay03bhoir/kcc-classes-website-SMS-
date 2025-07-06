"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaBook, FaUser, FaClock, FaGraduationCap } from "react-icons/fa";

export default function CourseList({ student }) {
  // Extract courses from student data
  const getCoursesFromStudent = (student) => {
    if (!student || !student.subjects || !Array.isArray(student.subjects)) return [];
    
    return student.subjects.map((subject) => {
      // Find the corresponding batch for this subject
      const batch = student.batches?.find(batch => 
        batch.subjectId?._id === subject._id || batch.subjectId === subject._id
      );
      
      // Get teacher information
      const teacher = subject.teachers?.[0] || batch?.teacherId;
      const teacherName = teacher?.name || "Teacher TBD";
      
      // Get schedule from batch timings
      const schedule = batch?.timings || "Schedule TBD";
      
      // Calculate progress based on attendance
      const attendanceRecords = student.attendance?.filter(att => 
        att.subject === subject._id || att.subject?._id === subject._id
      ) || [];
      
      const totalClasses = attendanceRecords.length;
      const attendedClasses = attendanceRecords.filter(att => att.status === 'present').length;
      const progress = totalClasses > 0 ? Math.round((attendedClasses / totalClasses) * 100) : 0;
      
      // Get latest score for this subject
      const subjectScores = student.scores?.filter(score => 
        score.subject === subject._id || score.subject?._id === subject._id
      ) || [];
      
      const latestScore = subjectScores.length > 0 
        ? subjectScores[subjectScores.length - 1] 
        : null;
      
      const grade = latestScore ? latestScore.score : "N/A";
      
      return {
        name: subject.name,
        teacher: teacherName,
        schedule: schedule,
        time: batch?.timings || "Time TBD",
        progress: progress,
        grade: grade,
        subjectId: subject._id,
        description: subject.description,
        category: subject.category,
        duration: subject.duration,
        classesPerWeek: subject.classesPerWeek
      };
    });
  };

  const courses = getCoursesFromStudent(student);

  const getProgressColor = (progress) => {
    if (progress >= 80) return "from-green-500 to-emerald-600";
    if (progress >= 60) return "from-blue-500 to-blue-600";
    return "from-yellow-500 to-orange-600";
  };

  const getGradeColor = (grade) => {
    if (grade === "N/A") return "text-gray-600 bg-gray-100";
    if (grade >= 90) return "text-green-600 bg-green-100";
    if (grade >= 80) return "text-blue-600 bg-blue-100";
    if (grade >= 70) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  // Show message if no courses
  if (!courses || courses.length === 0) {
    return (
      <div className="h-full">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg">
              <FaBook className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-xl font-bold text-gray-800">Enrolled Courses</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <FaBook className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No courses enrolled yet</p>
            <p className="text-gray-400 text-sm mt-1">Contact your administrator to enroll in courses</p>
          </div>
        </CardContent>
      </div>
    );
  }

  return (
    <div className="h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg">
            <FaBook className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-xl font-bold text-gray-800">Enrolled Courses</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {courses.map((course, idx) => (
            <div key={idx} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200 border border-gray-200">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 mb-1">{course.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <FaUser className="h-4 w-4" />
                    <span>{course.teacher}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FaClock className="h-4 w-4" />
                    <span>{course.schedule} • {course.time}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getGradeColor(course.grade)}`}>
                    {course.grade}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Course Progress</span>
                  <span className="text-sm font-bold text-gray-800">{course.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full bg-gradient-to-r ${getProgressColor(course.progress)}`}
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Course Summary */}
        <div className="mt-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FaGraduationCap className="h-5 w-5 text-indigo-600" />
              <span className="text-sm font-medium text-gray-700">Total Courses</span>
            </div>
            <span className="text-lg font-bold text-indigo-600">{courses.length}</span>
          </div>
        </div>
      </CardContent>
    </div>
  );
}
